import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Todo from "@/models/Todo";
import { createClient } from "@/lib/supabase/server";
import mongoose from "mongoose";
import {
  ERROR_MESSAGES,
  createErrorResponse,
  createSuccessResponse,
  handleValidationError,
  secureLog,
} from "@/lib/errors";
import { validateObjectId, validateAndSanitizeTodo } from "@/lib/validation";

/**
 * 특정 할 일 조회 (GET /api/todos/[id])
 */
export async function GET(request, { params }) {
  try {
    // Supabase 인증 확인
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = await params;

    // ObjectId 유효성 검사
    if (!validateObjectId(id)) {
      return createErrorResponse(ERROR_MESSAGES.INVALID_ID, 400);
    }

    // MongoDB 연결
    await connectDB();

    // 할 일 조회 (본인 것만)
    const todo = await Todo.findOne({ _id: id, userId: user.id });

    if (!todo) {
      return createErrorResponse(ERROR_MESSAGES.RESOURCE_NOT_FOUND, 404);
    }

    return createSuccessResponse(todo);
  } catch (error) {
    secureLog("TODO_GET_BY_ID", error, { userId: user?.id, todoId: id });
    return createErrorResponse(ERROR_MESSAGES.TODO_FETCH_FAILED, 500);
  }
}

/**
 * 할 일 수정 (PUT /api/todos/[id])
 */
export async function PUT(request, { params }) {
  try {
    // Supabase 인증 확인
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = await params;

    // ObjectId 유효성 검사
    if (!validateObjectId(id)) {
      return createErrorResponse(ERROR_MESSAGES.INVALID_ID, 400);
    }

    // 요청 본문 파싱 및 검증
    const body = await request.json();
    const validation = validateAndSanitizeTodo(body);

    if (!validation.isValid) {
      return createErrorResponse(
        `검증 실패: ${validation.errors.join(", ")}`,
        400
      );
    }

    const { title, description, completed, dueDate } = validation.data;

    // MongoDB 연결
    await connectDB();

    // 업데이트할 데이터 준비 (이미 검증되고 정제된 데이터 사용)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description || "";
    if (completed !== undefined) updateData.completed = completed;
    if (dueDate !== undefined)
      updateData.dueDate = dueDate ? new Date(dueDate) : null;

    // 할 일 업데이트 (본인 것만)
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, userId: user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return NextResponse.json(
        { error: "할 일을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return createSuccessResponse(updatedTodo);
  } catch (error) {
    secureLog("TODO_UPDATE", error, { userId: user?.id, todoId: id });

    // Mongoose 검증 오류 처리
    if (error.name === "ValidationError" || error.name === "CastError") {
      return handleValidationError(error);
    }

    return createErrorResponse(ERROR_MESSAGES.TODO_UPDATE_FAILED, 500);
  }
}

/**
 * 할 일 삭제 (DELETE /api/todos/[id])
 */
export async function DELETE(request, { params }) {
  try {
    // Supabase 인증 확인
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = await params;

    // ObjectId 유효성 검사
    if (!validateObjectId(id)) {
      return createErrorResponse(ERROR_MESSAGES.INVALID_ID, 400);
    }

    // MongoDB 연결
    await connectDB();

    // 할 일 삭제 (본인 것만)
    const deletedTodo = await Todo.findOneAndDelete({
      _id: id,
      userId: user.id,
    });

    if (!deletedTodo) {
      return NextResponse.json(
        { error: "할 일을 찾을 수 없습니다" },
        { status: 404 }
      );
    }

    return createSuccessResponse(deletedTodo, 200, "할 일이 삭제되었습니다");
  } catch (error) {
    secureLog("TODO_DELETE", error, { userId: user?.id, todoId: id });
    return createErrorResponse(ERROR_MESSAGES.TODO_DELETE_FAILED, 500);
  }
}

/**
 * 할 일 완료 상태 토글 (PATCH /api/todos/[id])
 */
export async function PATCH(request, { params }) {
  try {
    // Supabase 인증 확인
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401);
    }

    const { id } = await params;

    // ObjectId 유효성 검사
    if (!validateObjectId(id)) {
      return createErrorResponse(ERROR_MESSAGES.INVALID_ID, 400);
    }

    // MongoDB 연결
    await connectDB();

    // 할 일 찾기 (본인 것만)
    const todo = await Todo.findOne({ _id: id, userId: user.id });

    if (!todo) {
      return createErrorResponse(ERROR_MESSAGES.RESOURCE_NOT_FOUND, 404);
    }

    // 완료 상태 토글
    const updatedTodo = await todo.toggleComplete();

    return createSuccessResponse(updatedTodo);
  } catch (error) {
    secureLog("TODO_TOGGLE", error, { userId: user?.id, todoId: id });
    return createErrorResponse(ERROR_MESSAGES.TODO_UPDATE_FAILED, 500);
  }
}
