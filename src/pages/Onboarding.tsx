
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { strings } from "@/data/strings.ko"; // Assuming we might want to add strings later, or use existing generic ones
import { ArrowRight, TrendingUp, ShieldCheck, Zap } from "lucide-react";

const Onboarding = () => {
    const { completeOnboarding } = useUser();
    const navigate = useNavigate();

    const handleStart = () => {
        completeOnboarding();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-10 text-center safe-area-bottom pb-20">
            <div className="space-y-4 max-w-md animate-in fade-in zoom-in duration-500">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    {strings.app.title}에 오신 것을<br />환영합니다
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    AI가 분석하는 시장 흐름(CMI)과<br />
                    최적의 투자 전략을 제안받아보세요.
                </p>
            </div>

            <div className="grid gap-6 w-full max-w-sm">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 text-left">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Zap className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold">실시간 마켓 타이밍</h3>
                        <p className="text-xs text-muted-foreground">시장의 공포/탐욕 지수를 AI가 분석합니다.</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border/50 text-left">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                        <h3 className="font-semibold">맞춤형 리스크 관리</h3>
                        <p className="text-xs text-muted-foreground">내 포트폴리오의 위험 요소를 진단합니다.</p>
                    </div>
                </div>
            </div>

            <div className="w-full max-w-sm pt-8">
                <Button size="lg" className="w-full text-lg h-14" onClick={handleStart}>
                    시작하기
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>
        </div>
    );
};

export default Onboarding;
