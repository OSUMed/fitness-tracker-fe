import React from "react";
import { UserContext } from "../context/UserContext";
import { UserContextType } from "../context/UserContext";
import { useContext } from "react";
import { Context } from "react";
import { Button, Flex, Table } from "@radix-ui/themes";
import { format } from "date-fns";
import "../custom-styles.css";

const SummaryWorkouts = () => {
  const {
    historyRecordedWorkouts,
    setHistoryRecordedWorkouts,
    allSummaryRecordedWorkouts,
    setAllSummaryRecordedWorkouts,
    summaryRecordedWorkouts,
    setSummaryRecordedWorkouts,
  } = useContext<UserContextType>(UserContext as Context<UserContextType>);

  return (
    <div>
      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell className="text-center">
              Date
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-center">
              Workout Types
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-center">
              Total Exercises
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-center">
              Total Sets
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="text-center">
              Actions
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {allSummaryRecordedWorkouts.map((summary) => {
            // Split summaryDetails to individual columns
            const [types, exercises, sets] =
              summary.summaryDetails.split(" | ");

            return (
              <Table.Row key={summary.id}>
                <Table.Cell>{format(summary.date, "yyyy-MM-dd")}</Table.Cell>
                <Table.Cell>{types}</Table.Cell>
                <Table.Cell>{exercises}</Table.Cell>
                <Table.Cell>{sets}</Table.Cell>
                <Table.Cell className="space-x-2">
                  <Flex direction="column" gap="2">
                    <Button variant="solid" color="blue">
                      Details
                    </Button>
                    <Button variant="ghost" color="orange">
                      Edit Workouts
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default SummaryWorkouts;
