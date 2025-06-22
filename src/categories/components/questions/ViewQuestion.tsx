import React, { useEffect, useState } from 'react';
import { useCategoryContext } from 'categories/CategoryProvider'
import { FormMode, IQuestion } from "categories/types";
import QuestionForm from "categories/components/questions/QuestionForm";

const ViewQuestion = ({ inLine }: { inLine: boolean }) => {
    const { state } = useCategoryContext();
    const { questionLoading, firstLevelCategoryRows: categories, questionInAddingViewingOrEditing: questionInViewingOrEditing } = state;
    //const { partitionKey, id, parentCategory } = questionInViewingOrEditing!;

    const [question, setQuestion] = useState<IQuestion | null>(null);

    useEffect(() => {
        //const q = category!.questions.find(q => q.inEditing)
        //if (category) {
        //const q = category!.questions.find(q => q.id === id)
        console.log("#################################### ViewQuestion setQuestion ...", { questionInViewingOrEditing })
        //if (q) {
        setQuestion(questionInViewingOrEditing);
        //}
        //}
    }, [questionInViewingOrEditing]) // questionLoading
    // if (questionLoading)
    //     return <div>Loading question...</div>
    return (
        <QuestionForm
            question={question!}
            showCloseButton={true}
            source={0}
            formMode={FormMode.ViewingQuestion}
            submitForm={() => { }}
        >
            View Question
        </QuestionForm>
    );
}

export default ViewQuestion;
