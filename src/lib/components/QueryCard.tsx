import { UseQueryResult } from "@tanstack/react-query";
import { Card, CardProps } from "./Card";
import { match } from "ts-pattern";
import { forwardRef, ReactElement } from "react";

type Props<TData, TError> = Omit<CardProps, "children"> & {
  query: UseQueryResult<TData, TError>;
  children: (data: TData) => ReactElement;
};

export const QueryCardImpl = <TData, TError extends Error>(
  { query, children, ...cardProps }: Props<TData, TError>,
  ref: React.Ref<HTMLDivElement>
) => {
  return (
    <Card {...cardProps} ref={ref}>
      {match(query)
        .with({ isPending: true }, () => <p>Loading...</p>)
        .with({ isError: true }, ({ error }) => (
          <p>An error occured: {error.message}</p>
        ))
        .otherwise(({ data }) => children(data))}
    </Card>
  );
};
// Sadly, in order to preserve the generic type argument + ref forward we need this cast
export const QueryCard = forwardRef(QueryCardImpl) as <
  TData,
  TError extends Error,
>(
  props: Props<TData, TError> & { ref?: React.Ref<HTMLDivElement> }
) => ReactElement;
