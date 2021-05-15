import type { Answers } from 'inquirer';
import inquirer from 'inquirer';
import { areUnanswered, flatten as flattenAnswers, get as getAnswers, rememberAll } from './answer';
import type { Question, SubQuestion } from './question';
import { flatten as flattenQuestions, getNames, setDefaultValues } from './question';

const ask = async (
  questions: readonly Readonly<Question>[],
  defaultValues: Readonly<Answers> = {},
): Promise<Answers> => {
  const flattenedQuestions = flattenQuestions(questions);
  const flattenedQuestionNames = getNames(flattenedQuestions);
  const flattenedDefaults = flattenAnswers(defaultValues);

  const unansweredQuestionNames = areUnanswered(flattenedQuestionNames);
  const unansweredQuestions = flattenedQuestions.filter(
    (question: Readonly<SubQuestion>): boolean => unansweredQuestionNames.includes(question.name),
  );

  const questionsToAsk = setDefaultValues(unansweredQuestions, flattenedDefaults);

  const prompted = await inquirer
    .prompt(questionsToAsk)
    .then((answers: Readonly<Answers>): Answers => {
      rememberAll(flattenAnswers(answers));
      return {
        ...getAnswers(flattenedQuestionNames),
        ...answers,
      } as Answers;
    });

  return prompted;
};

export default ask;
