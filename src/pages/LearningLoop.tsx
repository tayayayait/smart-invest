import { MobileHeader } from "@/components/layout/MobileHeader";
import { JournalForm } from "@/components/journal/JournalForm";
import { ReplayPanel } from "@/components/journal/ReplayPanel";
import { strings } from "@/data/strings.ko";

const LearningLoop = () => {
  return (

    <>
      <MobileHeader title={strings.pages.learningLoopTitle} />
      <main className="px-4 py-4 space-y-6">
        <JournalForm />
        <ReplayPanel />
      </main>
    </>
  );
};

export default LearningLoop;
