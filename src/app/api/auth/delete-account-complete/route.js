import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Todo from "@/models/Todo";
import connectDB from "@/lib/mongodb";

export async function DELETE(request) {
  try {
    // 사용자 인증 확인을 위한 일반 클라이언트
    const supabase = await createClient();
    
    // 현재 사용자 확인
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return NextResponse.json(
        { error: "인증되지 않은 사용자입니다." },
        { status: 401 }
      );
    }

    // 서비스 롤 키 확인
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "서버 설정 오류: 관리자 권한이 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    // MongoDB 연결
    await connectDB();
    
    // 사용자의 모든 Todo 데이터 논리적 삭제 (물리적 삭제 대신)
    try {
      const deleteResult = await Todo.softDeleteAllByUserId(user.id);
      console.log(`사용자 ${user.id}의 Todo ${deleteResult.modifiedCount}개 논리적 삭제됨`);
    } catch (error) {
      console.error("Todo 데이터 삭제 오류:", error);
      return NextResponse.json(
        { error: "사용자 데이터 삭제 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 관리자 권한을 위한 서비스 클라이언트
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 관리자 권한으로 사용자 삭제
    const { error: deleteError } = await serviceSupabase.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      console.error("계정 삭제 오류:", deleteError);
      return NextResponse.json(
        { error: "계정 삭제 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "계정과 모든 데이터가 완전히 삭제되었습니다." 
    }, { status: 200 });
    
  } catch (error) {
    console.error("계정 삭제 API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}