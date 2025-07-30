"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function TodoPage() {
  function AddTodoCard() {
    const [task, setTask] = useState("");

    const handleAdd = () => {
      if (task.trim() === "") return;
      setTask(""); // 입력 초기화
    };

    return (
      <Card>
        <CardHeader>
          <CardTitle>작업 추가</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Input
              placeholder="할 일을 입력하세요"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            />
            <Button onClick={handleAdd}>추가</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <AddTodoCard />
    </>
  );
}
