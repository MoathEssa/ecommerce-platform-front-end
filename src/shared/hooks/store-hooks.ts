import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@app/store";

export function useAppDispatch(): AppDispatch {
  return useDispatch<AppDispatch>();
}

export function useAppSelector<TSelected>(
  selector: (state: RootState) => TSelected,
): TSelected {
  return useSelector<RootState, TSelected>(selector);
}
