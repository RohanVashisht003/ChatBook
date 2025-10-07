import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { SignedOut, SignInButton } from "@clerk/nextjs";
export default function Home() {
  return (
    <div className="">
      <Header />
      <main className="flex-1 flex flex-col items-center px-4 py-16 sm:px-6 text-center gap-20">
        <div className="relative space-y-8">
          <div className="absolute inset-0 bg-gradient-to-br opacity-60">
            <div>
              <h1>
                Connect Instantly
                <br />
                <span>Chat Smartly</span>
              </h1>
              <p>Some Description</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center">
            <SignedOut>
              <SignInButton mode="modal">
                <Button size={'lg'}>Start Free Chatting</Button>
              </SignInButton>
            </SignedOut>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
