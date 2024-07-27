import { useEffect, useState } from "react";
import moment from "moment";

const CountdownTimer = ({ targetDate }) => {
  const [daysLeft, setDaysLeft] = useState(0);

  const minusClass =
    daysLeft < 0
      ? "text-center bg-red-500 text-white p-2 rounded-lg"
      : "text-center p-2 bg-green-500 text-white rounded-lg";

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = moment();
      const days = moment(targetDate).diff(now, "days");
      setDaysLeft(days);
    }, 0);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  return <p className={minusClass}>{daysLeft} hari lagi</p>;
};

export default CountdownTimer;
