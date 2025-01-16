import { UseQueryResult } from "@tanstack/react-query";
import { Card, CardProps } from "./Card";
import { match } from "ts-pattern";
import { ReactElement } from "react";

type Props<TData, TError> = Omit<CardProps, "children"> & {
  query: UseQueryResult<TData, TError>;
  children: (data: TData) => ReactElement;
};
export const QueryCard = <TData, TError extends Error>({
  query,
  ...props
}: Props<TData, TError>) => {
  return (
    <Card {...props}>
      {match(query)
        .with({ isPending: true }, () => <p>Loading...</p>)
        .with({ isError: true }, ({ error }) => (
          <p>An error occured: {error.message}</p>
        ))
        .otherwise(({ data }) => props.children(data))}
    </Card>
  );
};
