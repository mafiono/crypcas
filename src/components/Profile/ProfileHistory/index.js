import React, { Component } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import intl from "react-intl-universal";
import memoizeOne from "memoize-one";
import { format } from "date-fns";
import { KeyboardDatePicker } from "@material-ui/pickers";
import {
  Box,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Divider,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Grid,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Typography,
} from "@material-ui/core";
import { ExpandMore, Close } from "@material-ui/icons";
import {
  getAccountHistory,
  getTransactionHistory,
  getRoundsHistory,
  getCashBonusHistory,
  getFreeSpinBonusHistory,
  cancelTransaction,
} from "../../../helpers/request";
import { displayCurrency } from "../../../helpers/currency";
import { get } from "lodash";
import trustTrackerLogo from "../../../images/trusttracker/logo.png";
import trustTrackerShield from "../../../images/trusttracker/shield.png";
import appStore from "../../../images/trusttracker/appstore.png";
import googlePlay from "../../../images/trusttracker/googleplay.png";
import QRCode from "qrcode.react";

const transactionHistoryStatuses = {
  PREPARING_TRANSACTION: "PREPARING_TRANSACTION",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  PENDING_NOTIFICATION: "PENDING_NOTIFICATION",
  PENDING_CONFIRMATION: "PENDING_CONFIRMATION",
  REJECTED: "REJECTED",
  CANCELED: "CANCELED",
  VOIDED: "VOIDED",
  PENDING_APPROVAL: "PENDING_APPROVAL",
  AUTHORIZED: "AUTHORIZED",
  REQUEST_SENT: "REQUEST_SENT",
};
const getIntlOfTransactionHistoryStatus = (status) => {
  switch (status) {
    case transactionHistoryStatuses.PREPARING_TRANSACTION:
      return intl
        .get("profile.history.transaction.status.preparingTransaction")
        .defaultMessage("Preparing");
    case transactionHistoryStatuses.SUCCESS:
      return intl
        .get("profile.history.transaction.status.success")
        .defaultMessage("Completed");
    case transactionHistoryStatuses.ERROR:
      return intl
        .get("profile.history.transaction.status.error")
        .defaultMessage("Error");
    case transactionHistoryStatuses.PENDING_NOTIFICATION:
      return intl
        .get("profile.history.transaction.status.pendingNotification")
        .defaultMessage("Processing");
    case transactionHistoryStatuses.PENDING_CONFIRMATION:
      return intl
        .get("profile.history.transaction.status.pendingConfirmation")
        .defaultMessage("Confirmation");
    case transactionHistoryStatuses.REJECTED:
      return intl
        .get("profile.history.transaction.status.rejected")
        .defaultMessage("Rejected");
    case transactionHistoryStatuses.CANCELED:
      return intl
        .get("profile.history.transaction.status.canceled")
        .defaultMessage("Canceled");
    case transactionHistoryStatuses.VOIDED:
      return intl
        .get("profile.history.transaction.status.voided")
        .defaultMessage("Voided");
    case transactionHistoryStatuses.PENDING_APPROVAL:
      return intl
        .get("profile.history.transaction.status.pendingApproval")
        .defaultMessage("Confirmation");
    case transactionHistoryStatuses.AUTHORIZED:
      return intl
        .get("profile.history.transaction.status.authorized")
        .defaultMessage("Authorized");
    case transactionHistoryStatuses.REQUEST_SENT:
      return intl
        .get("profile.history.transaction.status.requestSent")
        .defaultMessage("Request sent");
    default:
      return status;
  }
};

const BET_HISTORY = 0;
const TRANS_HISTORY = 1;
const ROUNDS_HISTORY = 2;
const BONUS_HISTORY = 3;
const SPINS_HISTORY = 4;

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_ITEMS = 10;

@withStyles((theme) => ({
  root: {},
  tabContainer: {
    margin: theme.spacing(1, 0),
  },
  tabButton: {
    marginRight: theme.spacing(1),
    borderRadius: 0,
    border: "2px solid",
    borderColor: theme.palette.background.default,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
  },
  activeTab: {
    borderColor: theme.palette.primary.dark,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  historyTableWrapper: {
    margin: theme.spacing(4, 0),
    backgroundColor: "transparent",
  },
  historyTableContainer: {
    maxHeight: `calc(100vh - ${
      theme.custom.size.headerHeight
    } - ${theme.spacing(4)}px)`,
  },
  historyTableHeader: {
    padding: 0,
    backgroundColor: theme.palette.background.paper,
    "& > div": {
      textAlign: "center",
      margin: theme.spacing(0, 0.5),
      padding: theme.spacing(1),
      backgroundColor: theme.palette.background.default,
    },
    "&:first-child > div": {
      marginLeft: 0,
    },
    "&:last-child > div": {
      marginRight: 0,
    },
    "&:last-child": {
      paddingRight: 0,
    },
  },
  link: {
    color: theme.palette.primary.main,
    textDecoration: "none",
  },
  ttDialoglink: {
    color: "black",
  },
  trustTrackerShield: {
    maxWidth: "28px",
    maxHeight: "28px",
  },
  trustTrackerHeader: {
    backgroundColor: "#34D05B",
    color: "#056F42",
  },
  trustTrackerCloseIcon: {
    color: "#056F42",
  },
  trustTrackerBody: {
    backgroundColor: "white",
    color: "black",
  },
}))
class ProfileHistory extends Component {
  state = {
    tab: this.getInitialTab(),
    // Restritions
    minDateRange: new Date("2000-01-01"),
    maxDateRange: new Date(),
    // Filters
    dateFrom: null,
    dateTo: null,
    page: 0,
    pageItems: DEFAULT_PAGE_ITEMS,
    pageCount: 1,
    // Response Data
    tableData: null,
    accountHistory: {},
    transactionHistory: {},
    // Games List Dialog
    transactionListOpen: false,
    transactionList: [],
    // Games List Dialog
    trustTrackerOpen: false,
    trustTrackerBetId: "",
    // Games List Dialog
    gamesListOpen: false,
    gamesList: [],
    // Shape: {[transactionId]: 'canceling' | 'failed' | 'request_sent' ]}
    cancelingTransaction: {},
  };

  getInitialTab() {
    // Check the hash if provided
    const hash = get(this.props, ["route", "location", "hash"]);
    // Default to bet history if no matches
    let tab = BET_HISTORY;

    // Check the hash for matches
    if (hash === "#transaction") {
      tab = TRANS_HISTORY;
    } else if (hash === "#rounds") {
      tab = ROUNDS_HISTORY;
    } else if (hash === "#bonus") {
      tab = BONUS_HISTORY;
    } else if (hash === "#spins") {
      tab = SPINS_HISTORY;
    }

    // Return the active tab
    return tab;
  }

  componentDidMount() {
    this.requestHistory();
  }

  requestHistory() {
    const { tab } = this.state;

    if (tab === BET_HISTORY) {
      this.requestAccountHistory();
    } else if (tab === TRANS_HISTORY) {
      this.requestTransactionHistory();
    } else if (tab === ROUNDS_HISTORY) {
      this.requestRoundsHistory();
    } else if (tab === BONUS_HISTORY) {
      this.requestCashBonusHistory();
    } else if (tab === SPINS_HISTORY) {
      this.requestFreeSpinHistory();
    }
  }

  getDateFrom() {
    const { dateFrom } = this.state;
    // Return the dateFrom, or a default
    return format(dateFrom || new Date("2000-01-01"), "yyyy-MM-dd");
  }

  getDateTo() {
    const { dateTo } = this.state;
    // Miliseconds in two days
    const msInDay = 172800000;
    // Default to date if 'dateTo' is not set
    const defaultTo = new Date(new Date().getTime() + msInDay);
    // Return the dateTo, or a default
    return format(dateTo || defaultTo, "yyyy-MM-dd");
  }

  requestAccountHistory() {
    const { page } = this.state;

    const data = {
      dateFrom: this.getDateFrom(),
      dateTo: this.getDateTo(),
      page: page || DEFAULT_PAGE,
    };
    getAccountHistory(data).then((accountHistory) => {
      const headerGame = intl
        .get("profile.history.header.game")
        .defaultMessage("Game");
      const headerDate = intl
        .get("profile.history.header.date")
        .defaultMessage("Date");
      const headerTime = intl
        .get("profile.history.header.time")
        .defaultMessage("Time");
      const headerAmount = intl
        .get("profile.history.header.amount")
        .defaultMessage("Amount");
      const headerBalance = intl
        .get("profile.history.header.balance")
        .defaultMessage("Balance");
      // Format the response into 'tableData'
      const tableData = {
        columns: [
          { key: 0, value: headerGame },
          { key: 1, value: headerDate },
          { key: 2, value: headerTime },
          { key: 3, value: headerAmount },
          { key: 4, value: headerBalance },
        ],
        rows: ((accountHistory && accountHistory.record) || []).map(
          (record) => ({
            key: record.accountId,
            columns: [
              {
                key: `${record.accountId}Game`,
                value: record.gameName || "N/A",
              },
              {
                key: `${record.accountId}Date`,
                value: format(new Date(record.date), "yyyy-MM-dd"),
              },
              {
                key: `${record.accountId}Time`,
                value: format(new Date(record.date), "HH:mm:ss"),
              },
              {
                key: `${record.accountId}Amount`,
                value: `${
                  record.type === "credit" ? "+" : "-"
                }${displayCurrency(record.amount)}`,
              },
              {
                key: `${record.accountId}Balance`,
                value: displayCurrency(record.balance),
              },
            ],
          })
        ),
      };
      // Store the response data
      this.setState({
        accountHistory,
        tableData,
        pageCount: accountHistory.pageCount,
      });
    });
  }

  requestCancelTransaction(transactionId) {
    const { cancelingTransaction, transactionHistory, tableData } = this.state;
    this.setState({
      cancelingTransaction: {
        ...cancelingTransaction,
        ...{ [transactionId]: "canceling" },
      },
    });

    cancelTransaction(transactionId)
      .then(() => {
        const newTransactionHistory = transactionHistory.transactions.map(
          (item) => {
            if (item.id === transactionId) {
              return {
                ...item,
                ...{ status: transactionHistoryStatuses.REQUEST_SENT },
              };
            }
            return item;
          }
        );

        const newTableRows = tableData.rows.map((item) => {
          if (item.key === transactionId) {
            const newColumns = item.columns.map((col) => {
              if (col.key === `${transactionId}Status`) {
                return {
                  key: `${transactionId}Status`,
                  value: getIntlOfTransactionHistoryStatus(
                    transactionHistoryStatuses.REQUEST_SENT
                  ),
                };
              }
              return col;
            });
            return { ...item, ...{ columns: newColumns } };
          }
          return item;
        });

        this.setState({
          transactionHistory: {
            ...transactionHistory,
            ...{
              transactions: newTransactionHistory,
            },
          },
          tableData: {
            ...tableData,
            ...{
              rows: newTableRows,
            },
          },
          cancelingTransaction: {
            ...cancelingTransaction,
            ...{ [transactionId]: "request_sent" },
          },
        });
      })
      .catch(() => {
        this.setState({
          cancelingTransaction: {
            ...cancelingTransaction,
            ...{ [transactionId]: "failed" },
          },
        });
      });
  }

  requestTransactionHistory() {
    const { action, page, pageItems } = this.state;

    const data = {
      dateFrom: this.getDateFrom(),
      dateTo: this.getDateTo(),
      action: action || "",
      requestedPage: page || DEFAULT_PAGE,
      requestedRecords: pageItems || DEFAULT_PAGE_ITEMS,
    };
    getTransactionHistory(data).then((transactionHistory) => {
      const headerMethod = intl
        .get("profile.history.header.method")
        .defaultMessage("Method");
      const headerDate = intl
        .get("profile.history.header.date")
        .defaultMessage("Date");
      const headerTime = intl
        .get("profile.history.header.time")
        .defaultMessage("Time");
      const headerType = intl
        .get("profile.history.header.type")
        .defaultMessage("Type");
      const headerAmount = intl
        .get("profile.history.header.amount")
        .defaultMessage("Amount");
      const headerStatus = intl
        .get("profile.history.header.status")
        .defaultMessage("Status");
      // Format the response into 'tableData'
      const tableData = {
        columns: [
          { key: 0, value: headerMethod },
          { key: 1, value: headerDate },
          { key: 2, value: headerTime },
          { key: 3, value: headerType },
          { key: 4, value: headerAmount },
          { key: 5, value: headerStatus },
        ],
        rows: (
          (transactionHistory && transactionHistory.transactions) ||
          []
        ).map((record) => ({
          key: record.id,
          columns: [
            { key: `${record.id}Method`, value: record.paymentMethod || "N/A" },
            {
              key: `${record.id}Date`,
              value: format(new Date(record.updated), "yyyy-MM-dd"),
            },
            {
              key: `${record.id}Time`,
              value: format(new Date(record.updated), "HH:mm:ss"),
            },
            { key: `${record.id}Type`, value: record.action },
            {
              key: `${record.id}Amount`,
              value: `${
                record.action === "DEPOSIT" ? "+" : "-"
              }${displayCurrency(
                record.requestedAmount,
                record.requestedCurrency
              )}`,
            },
            record.action === "WITHDRAW" &&
            record.status === transactionHistoryStatuses.PENDING_APPROVAL
              ? {
                  key: `${record.id}Status`,
                  value: getIntlOfTransactionHistoryStatus(record.status),
                  special: "ShowTransactionsCancelBtn",
                  transactionId: record.id,
                }
              : {
                  key: `${record.id}Status`,
                  value: getIntlOfTransactionHistoryStatus(record.status),
                },
          ],
        })),
      };
      // Store the response data
      this.setState({
        transactionHistory,
        tableData,
        pageCount: transactionHistory.totalPages,
      });
    });
  }

  requestRoundsHistory() {
    const { page } = this.state;

    const data = {
      dateFrom: this.getDateFrom(),
      dateTo: this.getDateTo(),
      page: page || DEFAULT_PAGE,
    };
    getRoundsHistory(data).then((roundsHistory) => {
      const headerBetCode = intl
        .get("profile.history.header.betCode")
        .defaultMessage("Bet Code");
      const headerWin = intl
        .get("profile.history.header.win")
        .defaultMessage("Win");
      const headerGame = intl
        .get("profile.history.header.game")
        .defaultMessage("Game");
      const headerClosed = intl
        .get("profile.history.header.closed")
        .defaultMessage("Closed");
      const headerTransactions = intl
        .get("profile.history.header.transactions")
        .defaultMessage("Transactions");
      const headerTrustTracker = intl
        .get("profile.history.header.trustTracker")
        .defaultMessage("Trust Tracker");
      // Closed Statuses
      const yesLbl = intl
        .get("profile.history.label.yes")
        .defaultMessage("Yes");
      const noLbl = intl.get("profile.history.label.no").defaultMessage("No");
      // Transform map of records into array
      const recordArray =
        (roundsHistory &&
          roundsHistory.rounds &&
          Object.values(roundsHistory.rounds).sort(
            (a, b) => b.sorting - a.sorting
          )) ||
        [];
      // Format the response into 'tableData'
      const tableData = {
        columns: [
          { key: 0, value: headerBetCode },
          { key: 1, value: headerWin },
          { key: 2, value: headerGame },
          { key: 3, value: headerClosed },
          { key: 4, value: headerTransactions },
          { key: 5, value: headerTrustTracker },
        ],
        rows: recordArray.map((record) => ({
          key: record.roundId,
          columns: [
            {
              key: `${record.roundId}BetCode`,
              special: "ShowBetCodeLink",
              roundId: record.roundId,
              isClosed: record.isClosed,
            },
            { key: `${record.roundId}Win`, value: displayCurrency(record.win) },
            { key: `${record.roundId}Game`, value: record.gameTitle },
            {
              key: `${record.roundId}Closed`,
              value: record.isClosed ? yesLbl : noLbl,
            },
            {
              key: `${record.roundId}Transactions`,
              special: "ShowTransactionsListBtn",
              transactions: record.transactions || [],
            },
            {
              key: `${record.roundId}TrustTracker`,
              special: "ShowTrustTrackerBtn",
              roundId: record.roundId,
              isClosed: record.isClosed,
            },
          ],
        })),
      };
      // Store the response data
      this.setState({
        transactionHistory: roundsHistory,
        tableData,
        pageCount: roundsHistory.totalPages,
      });
    });
  }

  requestCashBonusHistory() {
    const { page, pageItems } = this.state;

    const data = {
      dateFrom: this.getDateFrom(),
      dateTo: this.getDateTo(),
      requestedPage: page || DEFAULT_PAGE,
      requestedRecords: pageItems || DEFAULT_PAGE_ITEMS,
    };
    getCashBonusHistory(data).then((cashBonusHistory) => {
      const headerName = intl
        .get("profile.history.header.name")
        .defaultMessage("Name");
      const headerDueDate = intl
        .get("profile.history.header.dueDate")
        .defaultMessage("Due Date");
      const headerBonusAmount = intl
        .get("profile.history.header.bonusAmount")
        .defaultMessage("Bonus Amount");
      const headerWageringRequirements = intl
        .get("profile.history.header.wageringRequirements")
        .defaultMessage("Wagering Requirements");
      const headerWageringAmount = intl
        .get("profile.history.header.wageringAmount")
        .defaultMessage("Wagering Amount");
      const headerWageringDone = intl
        .get("profile.history.header.wageringDone")
        .defaultMessage("Wagering Done");
      const headerStatus = intl
        .get("profile.history.header.status")
        .defaultMessage("Status");
      const headerGamesList = intl
        .get("profile.history.header.gamesList")
        .defaultMessage("Games List");
      // Format the response into 'tableData'
      //
      // cashBonusHistory.bonuses is an array, example data:
      //
      // games: Array, [{ id: "BSGLADIATOR", title: "Gladiator", supplier: "Betsoft" }]
      // id: 506,
      // name: "321.maxpayouttest",
      // code: "321.maxpayouttest",
      // startDate: "2020-01-02T01:00:00+01",
      // expireDate: "2020-01-31T01:00:00+01",
      // amount: 10000.0,
      // wageringMultiplier: 1.0,
      // wageringAmount: 10000.0,
      // wageringDone: 11519.370000000003,
      // status: "finished",
      // balance: -210.62999999992462,
      // rollover: 100.0,
      // rolloverMoney: 0.0,
      // release: 0.0,
      // channel: "all"
      const tableData = {
        columns: [
          { key: 0, value: headerName },
          { key: 1, value: headerDueDate },
          { key: 2, value: headerBonusAmount },
          { key: 3, value: headerWageringRequirements },
          { key: 4, value: headerWageringAmount },
          { key: 5, value: headerWageringDone },
          { key: 6, value: headerStatus },
          { key: 7, value: headerGamesList },
        ],
        rows: ((cashBonusHistory && cashBonusHistory.bonuses) || []).map(
          (record) => {
            let expDate = null;
            const dateMatch =
              record.expireDate && record.expireDate.match(/\d{4}-\d{2}-\d{2}/);
            if (dateMatch) {
              // The matched portion is the yyyy-mm-dd
              expDate = new Date(dateMatch[0]);
            }
            return {
              key: record.id,
              columns: [
                { key: `${record.id}Name`, value: record.name || "N/A" },
                {
                  key: `${record.id}DueDate`,
                  value: (expDate && format(expDate, "yyyy-MM-dd")) || "N/A",
                },
                {
                  key: `${record.id}BonusAmount`,
                  value: displayCurrency(record.amount),
                },
                {
                  key: `${record.id}WageringRequirements`,
                  value: displayCurrency(record.wageringMultiplier),
                },
                {
                  key: `${record.id}WageringAmount`,
                  value: displayCurrency(record.wageringAmount),
                },
                {
                  key: `${record.id}WageringDone`,
                  value: displayCurrency(record.wageringDone),
                },
                { key: `${record.id}Status`, value: record.status },
                {
                  key: `${record.id}GamesList`,
                  special: "ShowGamesListBtn",
                  gamesList: record.games,
                },
              ],
            };
          }
        ),
      };
      // Store the response data
      this.setState({
        cashBonusHistory,
        tableData,
        pageCount: cashBonusHistory.totalPages,
      });
    });
  }

  requestFreeSpinHistory() {
    const { page, pageItems } = this.state;

    const data = {
      dateFrom: this.getDateFrom(),
      dateTo: this.getDateTo(),
      requestedPage: page || DEFAULT_PAGE,
      requestedRecords: pageItems || DEFAULT_PAGE_ITEMS,
    };
    getFreeSpinBonusHistory(data).then((freeSpinHistory) => {
      const headerName = intl
        .get("profile.history.header.name")
        .defaultMessage("Name");
      const headerDueDate = intl
        .get("profile.history.header.dueDate")
        .defaultMessage("Due Date");
      const headerFSS = intl
        .get("profile.history.header.fss")
        .defaultMessage("FSS");
      const headerSpinsWin = intl
        .get("profile.history.header.spinsWin")
        .defaultMessage("Spins Win");
      const headerWageringRequirements = intl
        .get("profile.history.header.wageringRequirements")
        .defaultMessage("Wagering Requirements");
      const headerWageringAmount = intl
        .get("profile.history.header.wageringAmount")
        .defaultMessage("Wagering Amount");
      const headerWageringDone = intl
        .get("profile.history.header.wageringDone")
        .defaultMessage("Wagering Done");
      const headerStatus = intl
        .get("profile.history.header.status")
        .defaultMessage("Status");
      const headerGamesList = intl
        .get("profile.history.header.gamesList")
        .defaultMessage("Games List");
      // Format the response into 'tableData'
      //
      // freeSpinHistory.bonuses is an array, example data:
      //
      // games: Array, [{ id: "BSGLADIATOR", title: "Gladiator", supplier: "Betsoft" }]
      // id: 338,
      // status: "disabled",
      // name: "321FSbonusDeposit",
      // amount: 0.0,
      // wageringMultiplier: 1.0,
      // wageringAmount: 0.0,
      // wageringDone: 0.0,
      // expireDate: "2019-11-30T01:00:00+01",
      // rollover: 0.0,
      // initialRollover: 0.0,
      // spinNum: 100,
      // spinAmount: 0.0,
      // coinLevel: 2,
      // spinsLeft: 100,
      // spinsWin: 0.0
      // startDate: "2019-10-30T01:00:00+01",
      // termsUrl: "T&C",
      const tableData = {
        columns: [
          { key: 0, value: headerName },
          { key: 1, value: headerDueDate },
          { key: 2, value: headerFSS },
          { key: 3, value: headerSpinsWin },
          { key: 3, value: headerWageringRequirements },
          { key: 4, value: headerWageringAmount },
          { key: 5, value: headerWageringDone },
          { key: 6, value: headerStatus },
          { key: 7, value: headerGamesList },
        ],
        rows: ((freeSpinHistory && freeSpinHistory.bonuses) || []).map(
          (record) => {
            let expDate = null;
            const dateMatch =
              record.expireDate && record.expireDate.match(/\d{4}-\d{2}-\d{2}/);
            if (dateMatch) {
              // The matched portion is the yyyy-mm-dd
              expDate = new Date(dateMatch[0]);
            }
            return {
              key: record.id,
              columns: [
                { key: `${record.id}Name`, value: record.name || "N/A" },
                {
                  key: `${record.id}DueDate`,
                  value: (expDate && format(expDate, "yyyy-MM-dd")) || "N/A",
                },
                {
                  key: `${record.id}BonusFSS`,
                  value: `${record.spinsLeft}/${record.spinNum}`,
                },
                {
                  key: `${record.id}SpinsWin`,
                  value: displayCurrency(record.spinsWin),
                },
                {
                  key: `${record.id}WageringRequirements`,
                  value: displayCurrency(record.wageringMultiplier),
                },
                {
                  key: `${record.id}WageringAmount`,
                  value: displayCurrency(record.wageringAmount),
                },
                {
                  key: `${record.id}WageringDone`,
                  value: displayCurrency(record.wageringDone),
                },
                { key: `${record.id}Status`, value: record.status },
                {
                  key: `${record.id}GamesList`,
                  special: "ShowGamesListBtn",
                  gamesList: record.games,
                },
              ],
            };
          }
        ),
      };
      // Store the response data
      this.setState({
        freeSpinHistory,
        tableData,
        pageCount: freeSpinHistory.totalPages,
      });
    });
  }

  makeChangeTab(tab) {
    return () => {
      this.setState(
        {
          tab,
          page: 0,
          pageCount: 1,
          tableData: null,
        },
        this.requestHistory
      );
    };
  }

  makeDateFromChange() {
    return (dateFrom) => {
      this.setState({ dateFrom });
    };
  }

  memoizeDateFromChange = memoizeOne(this.makeDateFromChange);

  makeDateToChange() {
    return (dateTo) => {
      this.setState({ dateTo });
    };
  }

  memoizeDateToChange = memoizeOne(this.makeDateToChange);

  makeFilter() {
    return () => {
      this.requestHistory();
    };
  }

  makeChangePage() {
    return (event, page) => {
      this.setState({ page }, this.requestHistory);
    };
  }

  // Open Transaction List
  makeOpenTransactionsList(transactionList) {
    return () => {
      this.setState({ transactionList, transactionListOpen: true });
    };
  }

  // Close Transaction List
  makeCloseTransactionsList() {
    return () => {
      this.setState({ transactionList: [], transactionListOpen: false });
    };
  }

  // Open Trust Tracker
  makeOpenTrustTracker(trustTrackerBetId) {
    return () => {
      this.setState({ trustTrackerBetId, trustTrackerOpen: true });
    };
  }

  // Close Trust Tracker
  makeCloseTrustTracker() {
    return () => {
      this.setState({ trustTrackerBetId: "", trustTrackerOpen: false });
    };
  }

  // Open Games List
  makeOpenGamesList(gamesList) {
    return () => {
      this.setState({ gamesList, gamesListOpen: true });
    };
  }

  // Close Games List
  makeCloseGamesList() {
    return () => {
      this.setState({ gamesList: [], gamesListOpen: false });
    };
  }

  getSpecialCellContents(column) {
    const { classes, operatorId, trustTrackerURL } = this.props;
    if (column.special === "ShowBetCodeLink") {
      // Rounds History - Bet Code (Links to Trust Tracker if round closed)
      const linkTo = `${trustTrackerURL}/public-page/standard?operatorid=${operatorId}&betid=${column.roundId}`;
      return column.isClosed && operatorId ? (
        <a
          className={classes.link}
          href={linkTo}
          target="_blank"
          rel="noreferrer noopener"
        >
          {column.roundId}
        </a>
      ) : (
        <>{column.roundId}</>
      );
    } else if (column.special === "ShowTransactionsListBtn") {
      // Rounds History - Show Transactions List
      return (
        <Box width="100%" display="flex" justifyContent="center">
          <Button
            color="primary"
            variant="outlined"
            onClick={this.makeOpenTransactionsList(column.transactions)}
          >
            Show
          </Button>
        </Box>
      );
    } else if (column.special === "ShowTrustTrackerBtn") {
      // Rounds History - Open Trust Tracker Dialog (only available if round closed)
      const shieldStyle = {};
      const disabled = !column.isClosed || !operatorId;
      if (disabled) {
        shieldStyle.filter = "grayscale(1)";
      }
      return (
        <Box width="100%" display="flex" justifyContent="center">
          <Button
            color="primary"
            size="small"
            onClick={this.makeOpenTrustTracker(column.roundId)}
            disabled={disabled}
          >
            <img
              src={trustTrackerShield}
              alt=""
              className={classes.trustTrackerShield}
              style={shieldStyle}
            />
          </Button>
        </Box>
      );
    } else if (column.special === "ShowGamesListBtn") {
      // Cash/Free-Spins Bonus History - Show Applicable Games List
      return (
        <Box width="100%" display="flex" justifyContent="center">
          <Button
            color="primary"
            variant="outlined"
            onClick={this.makeOpenGamesList(column.gamesList)}
          >
            Show
          </Button>
        </Box>
      );
    } else if (column.special === "ShowTransactionsCancelBtn") {
      const { cancelingTransaction } = this.state;
      const cancelIntl = intl
        .get("generic.dialog.action.cancel")
        .defaultMessage("Cancel");

      return (
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          {column.value}
          {cancelingTransaction[column.transactionId] === "canceling" ? (
            <CircularProgress size={20} />
          ) : (
            <Button
              size="small"
              color="primary"
              variant="outlined"
              onClick={() =>
                this.requestCancelTransaction(column.transactionId)
              }
            >
              {cancelIntl}
            </Button>
          )}
        </Box>
      );
    }
    return <>N/A</>;
  }

  /**
   * Renders the History based on the Table Data object which contains columns (headers) and rows (data)
   */
  renderTable(data) {
    const { classes } = this.props;
    const { tableData, page, pageCount } = this.state;

    // Setup data to render, uses state properties if data was not explicitly passed
    const _tableData = data || tableData;
    const _page = data ? 0 : page;
    const _pageCount = data ? 1 : pageCount;

    // Messages
    const noHistory = intl
      .get("profile.history.label.noHistory")
      .defaultMessage("There is no history.");
    const pageDisplay = intl
      .get("profile.history.label.pageDisplay", {
        0: _page + 1,
        1: _pageCount,
      })
      .defaultMessage(`page ${_page + 1} of ${_pageCount}`);

    // Table Data will be null while loading
    if (!_tableData) {
      return <CircularProgress className={classes.historyTableWrapper} />;
    }

    const { columns, rows } = _tableData;

    // If Columns or Rows are not populated, there is nothing to display
    if (!(columns && columns.length) || !(rows && rows.length)) {
      return (
        <Typography className={classes.historyTableWrapper}>
          {noHistory}
        </Typography>
      );
    }

    // Table size="small|medium"
    return (
      <Paper className={classes.historyTableWrapper}>
        <TableContainer className={classes.historyTableContainer}>
          <Table stickyHeader size="small" aria-label="History">
            <TableHead>
              <TableRow hover>
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={classes.historyTableHeader}
                  >
                    <div>{column.value}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow hover key={row.key}>
                  {row.columns &&
                    row.columns.map((column) => {
                      let cellContents = <>{column.value}</>;
                      if (column.special) {
                        cellContents = this.getSpecialCellContents(column);
                      }
                      return (
                        <TableCell key={column.key}>{cellContents}</TableCell>
                      );
                    })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5]}
          component="div"
          count={_pageCount}
          rowsPerPage={1}
          page={_page}
          labelDisplayedRows={() => pageDisplay}
          onChangePage={this.makeChangePage()}
        />
      </Paper>
    );
  }

  /**
   * Renders the TransactionList that Round History entries have
   */
  renderTransactionList() {
    const { transactionList, transactionListOpen } = this.state;

    const title = intl
      .get("profile.history.transactionList.title")
      .defaultMessage("Transactions");
    const actionOkay = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");

    const headerId = intl.get("profile.history.header.id").defaultMessage("Id");
    const headerType = intl
      .get("profile.history.header.type")
      .defaultMessage("Type");
    const headerBalance = intl
      .get("profile.history.header.balance")
      .defaultMessage("Balance");
    const headerAmount = intl
      .get("profile.history.header.amount")
      .defaultMessage("Amount");
    const headerChangedAmount = intl
      .get("profile.history.header.changedAmount")
      .defaultMessage("Changed Amount");
    const headerBonusAmount = intl
      .get("profile.history.header.bonusAmount")
      .defaultMessage("Bonus Amount");
    const headerReleasedAmount = intl
      .get("profile.history.header.releasedAmount")
      .defaultMessage("Released Amount");
    const headerChangedDate = intl
      .get("profile.history.header.changedDate")
      .defaultMessage("Changed Date");

    // Build the Transaction Table Data
    const tableData = {
      columns: [
        { key: 0, value: headerId },
        { key: 1, value: headerType },
        { key: 2, value: headerBalance },
        { key: 3, value: headerAmount },
        { key: 4, value: headerChangedAmount },
        { key: 5, value: headerBonusAmount },
        { key: 6, value: headerReleasedAmount },
        { key: 7, value: headerChangedDate },
      ],
      rows:
        transactionList &&
        transactionList.map((record) => {
          let chngDate = null;
          const dateMatch =
            record.changeDate && record.changeDate.match(/\d{4}-\d{2}-\d{2}/);
          if (dateMatch) {
            // The matched portion is the yyyy-mm-dd
            chngDate = new Date(dateMatch[0]);
          }
          return {
            key: record.id,
            columns: [
              { key: `${record.id}Id`, value: record.id },
              { key: `${record.id}Type`, value: record.type },
              {
                key: `${record.id}Balance`,
                value: displayCurrency(record.newBalance),
              },
              {
                key: `${record.id}Amount`,
                value: displayCurrency(record.cashAmount),
              },
              {
                key: `${record.id}ChangedAmount`,
                value: displayCurrency(record.changeAmount),
              },
              {
                key: `${record.id}BonusAmount`,
                value: displayCurrency(record.bonusAmount),
              },
              {
                key: `${record.id}ReleasedAmount`,
                value: displayCurrency(record.releasedAmount),
              },
              {
                key: `${record.id}ChangedDate`,
                value: (chngDate && format(chngDate, "yyyy-MM-dd")) || "N/A",
              },
            ],
          };
        }),
    };

    // Build the content
    return (
      <Dialog
        open={transactionListOpen}
        onClose={this.makeCloseTransactionsList()}
        maxWidth={false}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{this.renderTable(tableData)}</DialogContent>
        <DialogActions>
          <Button onClick={this.makeCloseTransactionsList()}>
            {actionOkay}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  /**
   * Renders the Trust Tracker dialog available under Round History
   */
  renderTrustTracker() {
    const { trustTrackerBetId, trustTrackerOpen } = this.state;
    const { classes, operatorId, trustTrackerURL } = this.props;

    const title = intl
      .get("profile.history.trustTracker.title")
      .defaultMessage("TrustTracker™ Verification");
    const betIdLbl = intl
      .get("profile.history.trustTracker.betIdLbl", { 0: trustTrackerBetId })
      .defaultMessage(`BetID: ${trustTrackerBetId}`);

    const trustTrackerQRLink = `${trustTrackerURL}/public/bets/${operatorId}/${trustTrackerBetId}`;
    const trustTrackerLink = `${trustTrackerURL}/public-page/standard?operatorid=${operatorId}&betid=${trustTrackerBetId}`;
    const appStoreLink =
      "https://apps.apple.com/de/app/trusttracker/id1516306132";
    const googlePlayLink =
      "https://play.google.com/store/apps/details?id=mobile.trusttracker.com";

    return (
      <Dialog
        open={trustTrackerOpen}
        onClose={this.makeCloseTrustTracker()}
        maxWidth={false}
      >
        <DialogTitle className={classes.trustTrackerHeader}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {title}
            <Box ml={4}>
              <IconButton size="small" onClick={this.makeCloseTrustTracker()}>
                <Close className={classes.trustTrackerCloseIcon} />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent className={classes.trustTrackerBody}>
          <Box display="flex" alignItems="stretch">
            <Box display="flex" justifyContent="center" alignItems="center">
              <QRCode value={trustTrackerQRLink || ""} />
            </Box>
            <Box ml={2} display="flex" flexDirection="column">
              <Box>
                <img
                  src={trustTrackerLogo}
                  alt=""
                  style={{ maxHeight: "80px" }}
                />
              </Box>
              <Box mt={1} display="flex" justifyContent="space-around">
                <Box>
                  <a
                    href={appStoreLink}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img src={appStore} alt="" style={{ maxHeight: "40px" }} />
                  </a>
                </Box>
                <Box>
                  <a
                    href={googlePlayLink}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img
                      src={googlePlay}
                      alt=""
                      style={{ maxHeight: "40px" }}
                    />
                  </a>
                </Box>
              </Box>
            </Box>
          </Box>
          <Box mt={2}>
            <Typography>
              <a
                className={classes.ttDialoglink}
                href={trustTrackerLink}
                target="_blank"
                rel="noreferrer noopener"
              >
                {betIdLbl}
              </a>
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  /**
   * Renders the GamesList that Cash/FreeSpin Bonuses apply to
   */
  renderGamesList() {
    const { gamesList, gamesListOpen } = this.state;

    const title = intl
      .get("profile.history.gamesList.title")
      .defaultMessage("Applicable Games");
    const noGamesLabel = intl
      .get("profile.history.gamesList.noGames")
      .defaultMessage("No games found");
    const actionOkay = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");

    // Construct a map of suppliers containing their array of games
    const supplierGames = {};
    // Iterate over the games, adding them to their suppliers game array
    gamesList.forEach((game) => {
      // Does the supplier exist?
      if (!supplierGames[game.supplier]) {
        // no, create a list for it
        supplierGames[game.supplier] = [game.title];
      } else {
        // yes, push the game to its list
        supplierGames[game.supplier].push(game.title);
      }
    });

    // Get the entries for the supplierGames object
    const supplierEntries = Object.entries(supplierGames);

    // Build the content
    const content = supplierEntries.length ? (
      supplierEntries.map(([supplierName, gameList]) => (
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMore />}>
            <Typography color="primary">{supplierName}</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Box display="flex" flexDirection="column">
              {gameList &&
                gameList.map((gameName) => <Typography>{gameName}</Typography>)}
            </Box>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))
    ) : (
      <Typography>{noGamesLabel}</Typography>
    );

    return (
      <Dialog open={gamesListOpen} onClose={this.makeCloseGamesList()}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <DialogActions>
          <Button onClick={this.makeCloseGamesList()}>{actionOkay}</Button>
        </DialogActions>
      </Dialog>
    );
  }

  renderCancelTransactionFailedDialog() {
    const { cancelingTransaction } = this.state;

    const cancelingTransactionKey = Object.keys(cancelingTransaction).find(
      (key) =>
        cancelingTransaction[key] === "failed" ||
        cancelingTransaction[key] === "request_sent"
    );

    const handleOnCloseDialog = (cancelingTransactionKey) => () => {
      const newCancelingTransaction = Object.keys(cancelingTransaction).reduce(
        (acc, key) => {
          if (cancelingTransactionKey === key) {
            return acc;
          }
          return { ...acc, ...{ [key]: cancelingTransaction[key] } };
        },
        {}
      );
      this.setState({
        cancelingTransaction: newCancelingTransaction,
      });
    };

    const actionOkay = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");
    let titleIntl = intl
      .get("profile.history.transaction.cancel.dialogFailedTitle")
      .defaultMessage("Cancel Transaction Failed");
    let contentIntl = intl
      .get("profile.history.transaction.cancel.dialogFailedContent")
      .defaultMessage("Sorry, We can not cancel transaction");

    if (
      cancelingTransactionKey &&
      cancelingTransaction[cancelingTransactionKey] === "request_sent"
    ) {
      titleIntl = intl
        .get("profile.history.transaction.cancel.dialogRequestSentTitle")
        .defaultMessage("Cancel Transaction Request Sent");
      contentIntl = intl
        .get("profile.history.transaction.cancel.dialogRequestSentContent")
        .defaultMessage("Please, check transactions history later");
    }

    return (
      <Dialog
        open={cancelingTransactionKey}
        onClose={handleOnCloseDialog(cancelingTransactionKey)}
      >
        <DialogTitle>{titleIntl}</DialogTitle>
        <DialogContent>
          <Typography align="center">{contentIntl}</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOnCloseDialog(cancelingTransactionKey)}
          >
            {actionOkay}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  /**
   * Renders the filters used to control the displayed history
   */
  renderFilter() {
    const { dateFrom, dateTo, minDateRange, maxDateRange } = this.state;

    const inputDateFrom = intl
      .get("profile.history.input.dateFrom")
      .defaultMessage("Date From");
    const inputDateTo = intl
      .get("profile.history.input.dateTo")
      .defaultMessage("Date To");
    const invalidDateFormat = intl
      .get("validation.helper.invalidDateFormat")
      .defaultMessage("Invalid date format");

    const actionFilter = intl
      .get("profile.history.action.filter")
      .defaultMessage("Filter");

    const actionDialogOk = intl
      .get("generic.dialog.action.ok")
      .defaultMessage("Ok");
    const actionDialogCancel = intl
      .get("generic.dialog.action.cancel")
      .defaultMessage("Cancel");
    const actionDialogClear = intl
      .get("generic.date.dialog.action.clear")
      .defaultMessage("Clear");
    const actionDialogToday = intl
      .get("generic.date.dialog.action.today")
      .defaultMessage("Today");

    return (
      <Grid container alignItems="flex-end" spacing={1}>
        <Grid item>
          <KeyboardDatePicker
            clearable
            disableFuture
            variant="dialog"
            format="yyyy-MM-dd"
            id="dateFrom"
            label={inputDateFrom}
            name="dateFrom"
            value={dateFrom}
            onChange={this.memoizeDateFromChange()}
            invalidDateMessage={invalidDateFormat}
            minDate={minDateRange}
            maxDate={dateTo || maxDateRange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            okLabel={actionDialogOk}
            cancelLabel={actionDialogCancel}
            clearLabel={actionDialogClear}
          />
        </Grid>
        <Grid item>
          <KeyboardDatePicker
            clearable
            showTodayButton
            disableFuture
            variant="dialog"
            format="yyyy-MM-dd"
            id="dateTo"
            label={inputDateTo}
            name="dateTo"
            value={dateTo}
            onChange={this.memoizeDateToChange()}
            invalidDateMessage={invalidDateFormat}
            minDate={dateFrom ? dateFrom : minDateRange}
            maxDate={maxDateRange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            okLabel={actionDialogOk}
            cancelLabel={actionDialogCancel}
            clearLabel={actionDialogClear}
            todayLabel={actionDialogToday}
          />
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={this.makeFilter()}
          >
            {actionFilter}
          </Button>
        </Grid>
      </Grid>
    );
  }

  /**
   * Gets the class(es) to apply to the provided tab
   *
   * @param {Number} tab - the constant representing the tab this class should be applied to
   */
  getTabClass(tab) {
    const { classes } = this.props;
    return this.state.tab === tab
      ? `${classes.tabButton} ${classes.activeTab}`
      : classes.tabButton;
  }

  /**
   * Renders tabs for the various histories which may be viewed
   */
  renderTabs() {
    const { classes, operatorId, trustTrackerURL } = this.props;

    // Check if Trust Tracker is active (Rounds History only shown if Trust Tracker enabled)
    const trustTrackerActive = operatorId && trustTrackerURL;

    // Labels
    const labelBetHistory = intl
      .get("profile.history.tab.betHistory")
      .defaultMessage("Bet History");
    const labelTransactionHistory = intl
      .get("profile.history.tab.transactionHistory")
      .defaultMessage("Transaction History");
    const labelRoundsHistory = intl
      .get("profile.history.tab.roundsHistory")
      .defaultMessage("Rounds History");
    const labelBonusHistory = intl
      .get("profile.history.tab.bonusHistory")
      .defaultMessage("Bonus History");
    const labelFreeSpinsHistory = intl
      .get("profile.history.tab.freeSpinsHistory")
      .defaultMessage("Free Spins History");

    return (
      <div className={classes.tabContainer}>
        <Button
          className={this.getTabClass(BET_HISTORY)}
          onClick={this.makeChangeTab(BET_HISTORY)}
        >
          {labelBetHistory}
        </Button>
        <Button
          className={this.getTabClass(TRANS_HISTORY)}
          onClick={this.makeChangeTab(TRANS_HISTORY)}
        >
          {labelTransactionHistory}
        </Button>
        {trustTrackerActive && (
          <Button
            className={this.getTabClass(ROUNDS_HISTORY)}
            onClick={this.makeChangeTab(ROUNDS_HISTORY)}
          >
            {labelRoundsHistory}
          </Button>
        )}
        <Button
          className={this.getTabClass(BONUS_HISTORY)}
          onClick={this.makeChangeTab(BONUS_HISTORY)}
        >
          {labelBonusHistory}
        </Button>
        <Button
          className={this.getTabClass(SPINS_HISTORY)}
          onClick={this.makeChangeTab(SPINS_HISTORY)}
        >
          {labelFreeSpinsHistory}
        </Button>
      </div>
    );
  }

  render() {
    const { classes } = this.props;

    const title = intl.get("profile.history.title").defaultMessage("History");

    return (
      <div className={classes.root}>
        <Typography variant="h4">{title}</Typography>
        <Divider />
        {this.renderTabs()}
        {this.renderFilter()}
        {this.renderTable()}
        {this.renderTransactionList()}
        {this.renderTrustTracker()}
        {this.renderGamesList()}
        {this.renderCancelTransactionFailedDialog()}
      </div>
    );
  }
}

export default ProfileHistory;
