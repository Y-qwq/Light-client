import { useSelector, useDispatch } from "react-redux";
import { IState } from "@/redux/reducers";
import { useCallback, useMemo } from "react";
import { changeStarArticle, changeCollectArticle } from "@/api";
import { loginAction } from "@/redux/action";

interface IUseStarOrCollectArticle {
  (type: "collect" | "star"): [
    Set<string>,
    (article_id: string, isAdd: 0 | 1) => Promise<boolean>
  ];
}

const useStarOrCollectArticle: IUseStarOrCollectArticle = type => {
  const dispatch = useDispatch();
  const { _id, stars, collections } = useSelector(
    (state: IState) => state.user.info
  );

  const starsList = useMemo(() => new Set(stars), [stars]);
  const collectionsList = useMemo(() => new Set(collections), [collections]);

  const handleAction = useCallback(
    async (article_id: string, isAdd: 0 | 1) => {
      let res;
      if (type === "star") {
        res = await changeStarArticle(_id, article_id, isAdd);
      } else {
        res = await changeCollectArticle(_id, article_id, isAdd);
      }
      if (res.data.type === "success") {
        console.log(res.data);
        dispatch(loginAction.setUserInfo(res.data.user));
        return true;
      } else {
        return false;
      }
    },
    [_id, dispatch, type]
  );

  return [type === "collect" ? collectionsList : starsList, handleAction];
};

export default useStarOrCollectArticle;
