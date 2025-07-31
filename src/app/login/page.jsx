import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { googleLogin } from "./actions";

export default function LoginPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <Card className="w-[350px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-xl font-semibold">
            로그인
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          <form action={googleLogin}>
            <Button
              type="submit"
              variant="outline"
              className="flex items-center gap-2"
            >
              {/* 구글 로고 SVG 직접 작성 */}
              <svg
                className="h-5 w-5"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M533.5 278.4c0-18.6-1.6-37.3-5.1-55.4H272.1v104.9h147.5c-6.3 34.1-25.1 63.1-53.5 82.5v68.3h86.2c50.4-46.4 81.2-114.9 81.2-200.3z"
                  fill="#4285f4"
                />
                <path
                  d="M272.1 544.3c72.6 0 133.6-23.9 178.1-64.9l-86.2-68.3c-24 16.1-54.7 25.5-91.9 25.5-70.5 0-130.2-47.6-151.7-111.5H30.1v70.1c44.9 89.1 137.2 149.1 242 149.1z"
                  fill="#34a853"
                />
                <path
                  d="M120.4 325.1c-10.8-31.6-10.8-65.7 0-97.3V157.7H30.1c-39.9 79.8-39.9 173.8 0 253.6l90.3-70.2z"
                  fill="#fbbc04"
                />
                <path
                  d="M272.1 107.7c38.9 0 73.8 13.4 101.2 39.7l75.7-75.7C405.7 24.1 344.7 0 272.1 0 167.3 0 75 60 30.1 149.1l90.3 70.1c21.6-63.9 81.2-111.5 151.7-111.5z"
                  fill="#ea4335"
                />
              </svg>
              Google 계정으로 로그인
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
