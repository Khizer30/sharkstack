import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPortfolios } from "@/store/actions/portfolioActions";
import { normalizePortfolio } from "@/utils/portfolio";

export function usePortfolios() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((s) => s.portfolios);

  useEffect(() => {
    if (status === "idle") dispatch(fetchPortfolios());
  }, [status, dispatch]);

  const projects = useMemo(() => items.map(normalizePortfolio), [items]);

  return { projects, status };
}
