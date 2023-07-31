import { useQuery, gql } from "@apollo/client";

const GET_UBTC_CONVERT_RATE = gql`
    query GetUBTConvertRate($amount: Int, $currency: String) {
        getUBTConvertRate(amount: $amount, currency: $currency)
            @rest(
                type: "GetUBTConvertRate"
                path: "/api/site/convert/{args.currency}/?amount={args.amount}"
            ) {
            currency
            amount
        }
    }
`;

const useGetUBTConvertRate = (option) =>
  useQuery(GET_UBTC_CONVERT_RATE, option);

export default useGetUBTConvertRate;