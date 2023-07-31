import { useQuery, gql } from "@apollo/client";

const GET_BALANCE = gql`
    query GetBalance{
        getBalance(input:{id:"45464"}) @rest(
                method: "post"
                type: "GetBalance"
                path: "/api/site/get-balance"
                bodySerializer: "appendSession"
            ) {
            balance
            currency
            balances {
                cash {
                    amount
                    currency
                }
                bonus {
                    amount
                    currency
                }
                freeSpins {
                    amount
                    currency
                }
                totalBalance {
                    amount
                    currency
                }
            }
        }
    }
`;

const useGetBalance = (option) => useQuery(GET_BALANCE, option);

export default useGetBalance;