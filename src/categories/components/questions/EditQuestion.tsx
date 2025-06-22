import React, { useEffect, useState } from 'react';
import { useCategoryContext, useCategoryDispatch } from 'categories/CategoryProvider'
import { useGlobalContext, useGlobalState } from 'global/GlobalProvider'

import QuestionForm from "categories/components/questions/QuestionForm";
import { ActionTypes, FormMode, IQuestion, IQuestionKey, QuestionKey } from "categories/types";

const EditQuestion = ({ inLine, odakle }: { inLine: boolean, odakle: string }) => {
    const { state, updateQuestion } = useCategoryContext();
    const { questionLoading, questionInAddingViewingOrEditing } = state;
    if (!questionInAddingViewingOrEditing)
        return null;

    const { rootId } = questionInAddingViewingOrEditing!;

    console.log("#################################### EditQuestion inLine:", { inLine }, { questionInAddingViewingOrEditing })

    if (!questionInAddingViewingOrEditing) {
        console.log("#################################### EditQuestion loading ...")
        return <div>Loading question to edit...</div>
    }

    const submitForm = async (questionObject: IQuestion) => {
        const newQuestion: IQuestion = {
            ...questionObject,
            created: undefined,
            modified: {
                time: new Date(),
                nickName: ''
            }
        }

        const { parentCategory } = questionInAddingViewingOrEditing;
        const categoryChanged = parentCategory !== newQuestion.parentCategory;
        //const questionKey = new QuestionKey(questionInAddingViewingOrEditing).questionKey;
        const question = await updateQuestion(rootId!, parentCategory!, newQuestion, categoryChanged);
        if (questionInAddingViewingOrEditing.parentCategory !== question.parentCategory) {
            /*
             await loadAllCategoryRows(); // reload, group could have been changed
             await openCategoryNode({ partitionKey: '', id: q.parentCategory, questionId: q.id });
            */
        }
        // if (categoryChanged) {
        //     setTimeout(() => dispatch({ type: ActionTypes.CLOSE_QUESTION_FORM, payload: { question: question } }), 1000);
        // }
    };
    
    return (
        <QuestionForm
            question={questionInAddingViewingOrEditing!}
            showCloseButton={true}
            source={0}
            formMode={FormMode.EditingQuestion}
            submitForm={submitForm}
        >
            Update Question
        </QuestionForm>
    );
};

export default EditQuestion;
