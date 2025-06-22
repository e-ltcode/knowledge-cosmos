import React, { useState } from "react";
import { useCategoryContext, useCategoryDispatch } from 'categories/CategoryProvider'
import { useGlobalState } from 'global/GlobalProvider'

import QuestionForm from "categories/components/questions/QuestionForm";
import { ActionTypes, FormMode, IQuestion, IQuestionRow } from "categories/types";
import { initialQuestion } from "categories/CategoriesReducer";

interface IProps {
    closeModal?: () => void;
    showCloseButton?: boolean;
    source?: number;
    setError?: (msg: string) => void;
}

const AddQuestion = ({ closeModal, showCloseButton, source, setError }: IProps) => {

    const { state, createQuestion } = useCategoryContext();
    const { questionInAddingViewingOrEditing } = state;
    const { rootId } = questionInAddingViewingOrEditing!;

    // const { state, createQuestion, openCategoryNode } = useCategoryContext();
    if (!closeModal) {
        // const cat = state.firstLevelCategoryRows.find(c => c.id === questionRow.parentCategory)
        // questionRow.categoryTitle = cat ? cat.title : '';
    }

    const [formValues] = useState(questionInAddingViewingOrEditing);

    const submitForm = async (questionObject: IQuestion) => {
        const newQuestion: IQuestion = {
            ...questionObject,
            created: {
                time: new Date(),
                nickName: ''
            },
            modified: undefined
        }
        const q = await createQuestion(newQuestion, closeModal !== undefined);
        if (q) {
            if (q.message) {
                setError!(q.message)
            }
            else if (closeModal) {
                closeModal();
                //dispatch({ type: ActionTypes.CLEAN_TREE, payload: { id: q.parentCategory } })
                //await openCategoryNode({ partitionKey: '', id: q.parentCategory, questionId: q.id });
            }
        }
    }
    return (
        <QuestionForm
            question={formValues!}
            showCloseButton={showCloseButton ?? true}
            source={source ?? 0}
            closeModal={closeModal}
            formMode={FormMode.AddingQuestion}
            submitForm={submitForm}
        >
            Create Question
        </QuestionForm >
    )
}

export default AddQuestion

