// @ts-nocheck
import React, { useState } from "react";
import "./App.css";
import {
  queryOptions,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  const [inputText, setInput] = useState("");
  const queryClient = useQueryClient();
  const todoListOptions = queryOptions({
    queryKey: ["users"],
    queryFn: async () =>
      await fetch("https://jsonplaceholder.typicode.com/todos").then(
        (response) => response.json()
      ),
  });
  const fetchPlaceholders = useQuery(todoListOptions);

  const addData = useMutation({
    mutationFn: () => {},
    onMutate: (data) => {
      const previousTodos = queryClient.getQueryData(
        fetchPlaceholders.queryKey
      );

      if (previousTodos) {
        queryClient.setQueryData(
          todoListOptions.queryKey,
          [...previousTodos, { ...data }],
          { shouldRefetch: false }
        );
      }

      return { previousTodos };
    },
    onError: (error) => console.log(error),
  });

  const { isPending, error, data } = fetchPlaceholders;
  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error?.message;

  return (
    <>
      <div style={{ position: "fixed", top: "0", left: "0" }}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInput(e.currentTarget.value)}
        />
        <button
          onClick={() =>
            addData.mutate({
              userId: 5000000,
              id: 500000,
              title: inputText,
              completed: false,
            })
          }
        >
          Add
        </button>
      </div>
      <div className="App">
        {data?.map((d) => (
          <div key={d.id}>{d.title}</div>
        ))}
      </div>
      ;
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}

export default App;
