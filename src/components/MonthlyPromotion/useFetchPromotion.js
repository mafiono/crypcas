import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSections } from "../../redux/selectors";
import { getDefaultPromotions } from "../../helpers/request";

const useFetchPromotion = () => {
  const sections = useSelector(getSections);
  const monthlyPromotionSection = useMemo(
    () => sections.find(({ systemTag }) => systemTag === "monthly-event"),
    [sections]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({});

  useEffect(() => {
    if (monthlyPromotionSection) {
      setLoading(true);
      getDefaultPromotions(monthlyPromotionSection.link)
        .then((res) => {
          setData(res);
        })
        .catch(() => {
          setError("Sorry, can not fetch data");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [monthlyPromotionSection]);
  return { loading, data, error };
};

export default useFetchPromotion;
