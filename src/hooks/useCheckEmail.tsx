import { useEffect, useState, useCallback } from "react";
import { debounce } from "lodash";
import { checkEmail } from "@/api";

const useCheckEmail = (email: string) => {
  const [hasEmail, setHasEmail] = useState(false);

  const handleCheckEmail = useCallback(
    debounce(async (email: string) => {
      const res = await checkEmail(email);
      setHasEmail(res.data.hasEmail);
    }, 500),
    []
  );

  useEffect(() => {
    if (/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(email)) {
      handleCheckEmail(email);
    } else {
      setHasEmail(preState => (preState ? false : preState));
    }
  }, [handleCheckEmail, email]);

  return hasEmail;
};

export default useCheckEmail;
