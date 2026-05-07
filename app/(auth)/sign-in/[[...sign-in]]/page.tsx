import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-md rounded-xl border border-yellow-300 bg-yellow-50 px-6 py-4 text-sm text-yellow-900 shadow-sm dark:border-yellow-700 dark:bg-yellow-950 dark:text-yellow-200">
        <p className="mb-2 font-semibold">Demo Account</p>
        <div className="space-y-1">
          <p>
            <span className="font-medium">Email:</span>{" "}
            <span className="font-mono select-all">tamir89089@lohinja.com</span>
          </p>
          <p>
            <span className="font-medium">Password:</span>{" "}
            <span className="font-mono select-all">lohinja@#123</span>
          </p>
        </div>
      </div>
      <SignIn />
    </div>
  );
};

export default SignInPage;
