import React from 'react';
import { useState } from "react";
import { useCategoryContext } from 'categories/CategoryProvider'
import { useGlobalState } from 'global/GlobalProvider'

import CategoryForm from "categories/components/CategoryForm";
import InLineCategoryForm from "categories/components/InLineCategoryForm";
import { FormMode, ICategory, ICategoryKey } from "categories/types";

// const AddCategory = ({ rootId, categoryKey, inLine }: { rootId: string, categoryKey: ICategoryKey, inLine: boolean }) => {
const AddCategory = () => {
    const globalState = useGlobalState();
    const { nickName } = globalState.authUser;
    const { createCategory, state } = useCategoryContext();
    const { categoryInAdding } = state;

    // do not use categoryKey
    // const category: ICategory = state.rootCategoryRows.find(c => c.inAdding)!;
    // console.assert(category, 'category.inAdding should have been found')

    const [formValues] = useState<ICategory>({ ...categoryInAdding! });

    const submitForm = async (category: ICategory) => {
        delete category.inAdding;
        //const id = categoryObject.title.split(' ')[0].toUpperCase();
        //const id = categoryObject.title.replace(' ', '_').toUpperCase();
        // set { partitionKey, id } at server
        const cat: ICategory = {
            ...category,
            //partitionKey: id,  // partitionKey is equal to id for categories
            //id,
            created: {
                time: new Date(),
                nickName: nickName
            },
            modified: undefined
        }
        console.log("**********object", cat)
        await createCategory(cat);
    }

    return (
        <>
            {/* {inLine ?
                <InLineCategoryForm
                    inLine={true}
                    category={formValues}
                    mode={FormMode.adding}
                    submitForm={submitForm}
                >
                    Create
                </InLineCategoryForm>
                : */}
            <CategoryForm
                inLine={false}
                category={formValues}
                questionId={null}
                formMode={FormMode.AddingCategory}
                submitForm={submitForm}
            >
                Create Category
            </CategoryForm >
            {/* } */}
        </>
    )
}

export default AddCategory
