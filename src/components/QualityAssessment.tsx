import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const questions = [
  {
    id: "q1",
    question: "How long did it take you to fall asleep last night?",
    options: [
      { value: "1", label: "Less than 15 minutes" },
      { value: "2", label: "15-30 minutes" },
      { value: "3", label: "30-60 minutes" },
      { value: "4", label: "More than 60 minutes" },
    ],
  },
  {
    id: "q2",
    question: "How many times did you wake up during last night?",
    options: [
      { value: "1", label: "Did not wake up" },
      { value: "2", label: "Once" },
      { value: "3", label: "2-3 times" },
      { value: "4", label: "More than 3 times" },
    ],
  },
  {
    id: "q3",
    question: "How refreshed do you feel this morning?",
    options: [
      { value: "1", label: "Very refreshed and energetic" },
      { value: "2", label: "Somewhat refreshed" },
      { value: "3", label: "Still tired" },
      { value: "4", label: "Exhausted" },
    ],
  },
  {
    id: "q4",
    question: "Did you experience any of these issues last night?",
    options: [
      { value: "1", label: "Slept peacefully" },
      { value: "2", label: "Light snoring or mild discomfort" },
      { value: "3", label: "Restlessness or frequent movement" },
      { value: "4", label: "Significant discomfort or breathing issues" },
    ],
  },
  {
    id: "q5",
    question: "How would you rate the overall quality of last night's sleep?",
    options: [
      { value: "1", label: "Excellent - best sleep in a while" },
      { value: "2", label: "Good - better than usual" },
      { value: "3", label: "Fair - could have been better" },
      { value: "4", label: "Poor - unsatisfactory sleep" },
    ],
  },
];

const resultCategories = {
  excellent: {
    title: "Excellent Sleep Last Night",
    description: "You had a great night's sleep! Your sleep quality indicators are very positive.",
    recommendations: [
      "Keep following your current bedtime routine",
      "Maintain your sleeping environment conditions",
      "Document what worked well for future reference",
    ],
    color: "bg-green-500",
  },
  good: {
    title: "Good Sleep Last Night",
    description: "Your sleep was generally good with some minor disturbances.",
    recommendations: [
      "Consider slight adjustments to your bedroom temperature",
      "Try to maintain the same bedtime tonight",
      "Reduce screen time before bed",
    ],
    color: "bg-sleep-medium",
  },
  fair: {
    title: "Fair Sleep Last Night",
    description: "Your sleep was somewhat disrupted. Here's how to improve tonight:",
    recommendations: [
      "Try going to bed 30 minutes earlier tonight",
      "Ensure your bedroom is dark and quiet",
      "Avoid caffeine for the rest of today",
      "Consider some light exercise during the day",
    ],
    color: "bg-yellow-500",
  },
  poor: {
    title: "Poor Sleep Last Night",
    description: "Your sleep was significantly disrupted. Let's focus on improvement for tonight:",
    recommendations: [
      "Take a short power nap (20 mins max) if needed today",
      "Stick to a consistent bedtime tonight despite poor sleep",
      "Practice relaxation techniques before bed tonight",
      "Avoid heavy meals close to bedtime",
    ],
    color: "bg-red-500",
  },
};

export const QualityAssessment: React.FC = () => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleNext = () => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    if (!answers[currentQuestionId]) {
      toast({
        title: "Please select an answer",
        description: "You need to select an option to continue",
        variant: "destructive",
      });
      return;
    }
    setDirection(1);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      let totalScore = 0;
      Object.values(answers).forEach((value) => {
        totalScore += parseInt(value);
      });
      setScore(totalScore);
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  const getResultCategory = () => {
    if (score <= 8) return resultCategories.excellent;
    if (score <= 12) return resultCategories.good;
    if (score <= 16) return resultCategories.fair;
    return resultCategories.poor;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const result = showResults ? getResultCategory() : null;

  return (
    <div className="animate-fade-in max-w-xl mx-auto px-4 md:px-0 space-y-6 pt-[64px] min-h-[500px]">
      <div>
        <h1 className="text-3xl font-bold">Sleep Quality Assessment</h1>
        <p className="text-muted-foreground">Evaluate your sleep quality and get personalized recommendations</p>
      </div>

      <AnimatePresence mode="wait" custom={direction}>
        {!showResults ? (
          <motion.div
            key={`question-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: direction > 0 ? 200 : -200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -200 : 200 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="sleep-card">
              <CardHeader>
                <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
                <CardDescription>{currentQuestion.question}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">{Math.round(progress)}% Complete</p>
                </div>
                <RadioGroup
                  value={answers[currentQuestion.id] || ""}
                  onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => {
                    const isSelected = answers[currentQuestion.id] === option.value;
                    return (
                      <div
                        key={option.value}
                        className={cn(
                          "flex items-center space-x-2 border rounded-lg p-4 transition-colors cursor-pointer",
                          "hover:bg-muted/50",
                          isSelected
                            ? "border-sleep-medium bg-sleep-light/10 ring-1 ring-sleep-medium font-semibold"
                            : "border-border"
                        )}
                      >
                        <RadioGroupItem value={option.value} id={`${currentQuestion.id}-${option.value}`} />
                        <Label htmlFor={`${currentQuestion.id}-${option.value}`} className="flex-1 cursor-pointer">
                          {option.label}
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>Previous</Button>
                <Button onClick={handleNext}>{currentQuestionIndex === questions.length - 1 ? "View Results" : "Next"}</Button>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="sleep-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{result?.title}</CardTitle>
                  <div className={`w-3 h-3 rounded-full ${result?.color}`}></div>
                </div>
                <CardDescription>{result?.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Your Sleep Score</h3>
                  <div className="h-4 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${result?.color}`} style={{ width: `${((20 - score) / 15) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                  <ul className="space-y-2">
                    {result?.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <div className="mr-3 mt-1 p-1 bg-sleep-light/20 rounded-full">
                          <AlertCircle className="h-3 w-3 text-sleep-medium" />
                        </div>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleReset} className="w-full">Take Assessment Again</Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QualityAssessment;
