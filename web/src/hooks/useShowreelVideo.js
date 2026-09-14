import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivities } from "@/store/actions/activityActions";
import { isVideoActivity } from "@/utils/activities";

export function useShowreelVideo() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.activities);

  useEffect(() => {
    if (status === "idle") dispatch(fetchActivities());
  }, [status, dispatch]);

  return useMemo(() => items.find(isVideoActivity)?.mediaURL ?? null, [items]);
}
