import { Reducer } from 'react'
import { ActionTypes, ICategoriesState, ICategory, IQuestion, CategoriesActions, ILocStorage, ICategoryKey, ICategoryKeyExtended, IQuestionRow, Question, IQuestionRowDto, IQuestionKey, CategoryKey, QuestionKey, ICategoryDto, QuestionRow, ICategoryRow, CategoryRow, actionsThatModifyFirstLevelCategoryRow, actionTypesToLocalStore as actionTypesStoringToLocalStore, ICategoryRowDto, FormMode } from "categories/types";

export const initialQuestion: IQuestion = {
  partitionKey: '',
  id: 'will be given by DB',
  parentCategory: '',
  categoryTitle: '',
  title: '',
  assignedAnswers: [],
  numOfAssignedAnswers: 0,
  relatedFilters: [],
  numOfRelatedFilters: 0,
  source: 0,
  status: 0,
  isSelected: false
}

export const initialCategory: ICategory = {
  partitionKey: 'null',
  id: '',
  kind: 0,
  title: '',
  link: '',
  header: '',
  level: 0,
  variations: [],
  rootId: '',
  parentCategory: 'null',
  hasSubCategories: false,
  subCategories: [],
  questionRows: [],
  numOfQuestions: 0,
  hasMoreQuestions: false,
  isExpanded: false
}

export const initialState: ICategoriesState = {
  formMode: FormMode.None,

  firstLevelCategoryRows: [],
  firstLevelCategoryRowsLoading: false,
  firstLevelCategoryRowsLoaded: false,

  categoryNodeOpening: false,
  categoryNodeOpened: false,

  categoryKeyExpanded: {
    partitionKey: "REMOTECTRLS",
    id: "REMOTECTRLS",
    questionId: "qqqqqq111"
  },
  categoryId_questionId_done: undefined,
  categoryInAdding: null,
  categoryInViewingOrEditing: null,

  questionInAddingViewingOrEditing: null,

  loading: false,
  questionLoading: false
}


// let state_fromLocalStorage: IState_fromLocalStorage | undefined;
// const hasMissingProps = (): boolean => {
//   let b = false;
//   const keys = Object.keys(initialStateFromLocalStorage!)
//   Object.keys(initialState).forEach((prop: string) => {
//     if (!keys.includes(prop)) {
//       b = true;
//       console.log('missing prop:', prop, ' try with SignOut')
//     }
//   })
//   return b;
// }

let initialCategoriesState: ICategoriesState = {
  ...initialState
}

if ('localStorage' in window) {
  console.log('Arghhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh CATEGORIES_STATE loaded before signIn')
  const s = localStorage.getItem('CATEGORIES_STATE');
  if (s !== null) {
    const locStorage = JSON.parse(s);
    const { lastCategoryKeyExpanded } = locStorage!;
    const categoryNodeOpened = lastCategoryKeyExpanded ? false : true;
    initialCategoriesState = {
      ...initialCategoriesState,
      categoryKeyExpanded: { ...lastCategoryKeyExpanded },
      categoryNodeOpened
    }
    console.log('initialCategoriesState nakon citanja iz memorije', initialCategoriesState);
  }
}

export { initialCategoriesState };

export const CategoriesReducer: Reducer<ICategoriesState, CategoriesActions> = (state, action) => {

  console.log('------------------------------->', action.type)
  // -----------------------------------------------------------------------
  // Rubljov, by giving the right name, you reveal the essence of things
  // -----------------------------------------------------------------------
  /*
  // - firstLevelCategoryRow AAA
  // ------> categoryRow AAA.1
  // --------- > categoryRow AAA 1.1
  // --------- > categoryRow AAA 1.2
  // ------------ > categoryRow AAA 1.2.1
  // ------------ > categoryRow AAA 1.2.2
  // --------- > categoryRow AAA 1.3
  // ------> categoryRow AAA.2
  // --------- > categoryRow AAA 2.1
  // --------- > categoryRow AAA 2.2
  // ------------ > Category Row AAA 2.2.1
  // ------------ > categoryRow AAA 2.2.2
  // --------- > categoryRow AAA 2.3
  // - firstLevelcategoryRow BBB
  // ------> categoryRow BBB.1
  // --------- > categoryRow BBB 1.1
  // --------- > categoryRow BBB 1.2
  // ------------ > categoryRow BBB 1.2.1
  // ------------ > categoryRow BBB 1.2.2
  // --------- > categoryRow BBB 1.3
  // ------> categoryRow BBB.2
  // --------- > categoryRow BBB 2.1
  // --------- > categoryRow BBB 2.2
  // ------------ > categoryRow BBB 2.2.1
  // ------------ > categoryRow BBB 2.2.2
  // --------- > categoryRow BBB 2.3
  // - firstLevelCategoryRow CCC
  // - ...
  */

  const { categoryRow } = action.payload;
  const { firstLevelCategoryRows } = state;

  let newFirstLevelCategoryRows: ICategoryRow[];
  if (categoryRow && actionsThatModifyFirstLevelCategoryRow.includes(action.type)) {
    const { rootId, id } = categoryRow;
    const firstLevelRow: ICategoryRow = firstLevelCategoryRows.find(c => c.id === rootId)!;
    DeepClone.idToSet = id;
    DeepClone.newCategoryRow = categoryRow;
    const newFirstLevelRow = new DeepClone(firstLevelRow).categoryRow;
    newFirstLevelCategoryRows = firstLevelCategoryRows.map(c => c.id === rootId
      ? newFirstLevelRow
      : new DeepClone(c).categoryRow
    );
  }
  else {
    // just clone to enable time-travel debugging
    DeepClone.idToSet = '';
    newFirstLevelCategoryRows = firstLevelCategoryRows.map(c => new DeepClone(c).categoryRow)
  }

  const state2 = {
    ...state,
    firstLevelCategoryRows: newFirstLevelCategoryRows
  }

  const newState = reducer(state2, action);

  if (actionTypesStoringToLocalStore.includes(action.type)) {
    const { categoryKeyExpanded } = newState;
    const locStorage: ILocStorage = {
      lastCategoryKeyExpanded: categoryKeyExpanded
    }
    localStorage.setItem('CATEGORIES_STATE', JSON.stringify(locStorage));
  }
  return newState;
}

const reducer = (state: ICategoriesState, action: CategoriesActions): ICategoriesState => {
  switch (action.type) {

    case ActionTypes.SET_FIRST_LEVEL_CATEGORY_ROWS_LOADING:
      return {
        ...state,
        firstLevelCategoryRowsLoading: true,
        firstLevelCategoryRowsLoaded: false,
      }

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: true
      }

    //////////////////////////////////////////////////
    // CategoryRows Level: 1
    case ActionTypes.SET_FIRST_LEVEL_CATEGORY_ROWS: {
      const { firstLevelCategoryRows } = action.payload;
      console.log('=> CategoriesReducer ActionTypes.SET_FIRST_LEVEL_CATEGORY_ROWS', { firstLevelCategoryRows })
      return {
        ...state,
        firstLevelCategoryRows,
        firstLevelCategoryRowsLoading: false,
        firstLevelCategoryRowsLoaded: true,
      };
    }


    case ActionTypes.CATEGORY_NODE_OPENING: {
      //const { categoryKeyExpanded } = action.payload;
      return {
        ...state,
        categoryNodeOpening: true,
        categoryNodeOpened: false
        //firstLevelCategoryRows: [],
        //categoryKeyExpanded
      }
    }

    case ActionTypes.SET_CATEGORY_NODE_OPENED: {
      const { categoryRow, questionId, fromChatBotDlg } = action.payload; // categoryKeyExpanded, 
      const { id } = categoryRow; //categoryKeyExpanded;
      const { firstLevelCategoryRows } = state;
      console.log('====== >>>>>>> CategoriesReducer ActionTypes.SET_CATEGORY_NODE_OPENED payload ', action.payload)
      const firstLevelRows: ICategoryRow[] = fromChatBotDlg
        ? []
        : firstLevelCategoryRows.map(c => c.id === categoryRow.id
          ? { ...categoryRow }
          : { ...c }
        )
      return {
        ...state,
        firstLevelCategoryRows: firstLevelRows,
        categoryId_questionId_done: `${id}_${questionId}`,
        categoryNodeOpening: false,
        categoryNodeOpened: true,
        //mode: Mode.NULL // reset previosly selected form
      };
    }

    case ActionTypes.FORCE_OPEN_CATEGORY_NODE:
      const { categoryKeyExpanded } = action.payload;
      return {
        ...state,
        categoryNodeOpening: false,
        categoryNodeOpened: false,
        firstLevelCategoryRows: [],
        firstLevelCategoryRowsLoaded: false,
        categoryKeyExpanded
      }

    case ActionTypes.SET_CATEGORY_LOADING:
      const { id, loading } = action.payload; // category doesn't contain inAdding 
      return {
        ...state,
        loading
      }

    case ActionTypes.SET_CATEGORY_QUESTIONS_LOADING:
      const { questionLoading } = action.payload; // category doesn't contain inAdding 
      return {
        ...state,
        questionLoading
      }




    // case ActionTypes.RESET_CATEGORY_QUESTION_DONE: {
    //   return {
    //     ...state,
    //     categoryId_questionId_done: undefined,
    //     categoryNodeLoaded: false
    //   };
    // }


    case ActionTypes.SET_SUB_CATEGORIES: {
      const { id, subCategoryRows } = action.payload;
      const { firstLevelCategoryRows: rootCategoryRows } = state;
      console.log('===========>>>>>>>>>> CategoriesReducer ActionTypes.SET_SUB_CATEGORIES', { subCategoryRows })
      subCategoryRows.forEach((categoryRow: ICategoryRow) => {
        const { id, hasSubCategories, numOfQuestions } = categoryRow;
      })
      return {
        ...state,
        loading: false
      };
    }


    case ActionTypes.SET_ERROR: {
      const { error, whichRowId } = action.payload; // category.id or question.id
      return {
        ...state,
        error,
        whichRowId,
        loading: false,
        questionLoading: false
        //categoryNodeLoading: false
      };
    }

    case ActionTypes.ADD_SUB_CATEGORY: {
      const { categoryKey, level, rootId } = action.payload;
      const { partitionKey, id } = categoryKey;
      const category: ICategory = {
        ...initialCategory,
        rootId,
        level,
        partitionKey: partitionKey!,
        parentCategory: id,
        inAdding: true
      }
      return {
        ...state,
        categoryInAdding: category,
        formMode: FormMode.AddingCategory
      };
    }

    case ActionTypes.SET_ADDED_CATEGORY: {
      const { category } = action.payload;
      return {
        ...state,
        // TODO Popravi
        formMode: FormMode.None,
        loading: false
      }
    }


    case ActionTypes.SET_CATEGORY: {
      const { categoryRow } = action.payload; // category doesn't contain  inAdding 
      const categoryInViewingOrEditing = categoryRow; //{ ...categoryRow, isExpanded: false }
      const { partitionKey, id, parentCategory, rootId } = categoryRow;
      const categoryKey = { partitionKey, id }
      return {
        ...state,
        // keep mode
        loading: false,
        //categoryKeyExpanded: { ...categoryKey, questionId: null },
        categoryInViewingOrEditing,
        questionInAddingViewingOrEditing: null
      }
    }


    case ActionTypes.SET_CATEGORY_ROW_EXPANDED: {
      const { categoryRow, formMode } = action.payload; // category doesn't contain  inAdding 
      const { partitionKey, id } = categoryRow;
      const categoryKey = { partitionKey, id };
      const { categoryKeyExpanded } = state;
      const { questionId } = categoryKeyExpanded!;
      return {
        ...state,
        // keep mode
        loading: false,
        categoryKeyExpanded: { ...categoryKey, questionId },
        categoryInAdding: null,
        categoryInViewingOrEditing: null,
        questionInAddingViewingOrEditing: null,
        formMode
      }
    }

    case ActionTypes.SET_CATEGORY_ROW_COLLAPSED: {
      const { categoryRow } = action.payload; // category doesn't contain  inAdding 
      const { partitionKey, id } = categoryRow;
      const categoryKey = { partitionKey, id }
      return {
        ...state,
        // keep mode
        loading: false,
        categoryKeyExpanded: null, //{ ...categoryKey, questionId: null },
        categoryInAdding: null,
        categoryInViewingOrEditing: null,
        questionInAddingViewingOrEditing: null
      }
    }


    case ActionTypes.SET_CATEGORY_TO_VIEW: {
      const { categoryRow } = action.payload;
      const categoryInViewingOrEditing = { ...categoryRow, isExpanded: false }
      const { partitionKey, id, parentCategory, rootId } = categoryRow;
      return {
        ...state,
        formMode: FormMode.ViewingCategory,
        loading: false,
        categoryKeyExpanded: state.categoryKeyExpanded ? { ...state.categoryKeyExpanded, questionId: null } : null,
        categoryInViewingOrEditing,
        questionInAddingViewingOrEditing: null
      };
    }

    case ActionTypes.SET_CATEGORY_TO_EDIT: {
      const { categoryRow } = action.payload; // ICategory extends ICategoryRow
      const categoryInViewingOrEditing = { ...categoryRow, isExpanded: false }
      const { partitionKey, id, parentCategory, rootId } = categoryRow;
      return {
        ...state,
        formMode: FormMode.EditingCategory,
        loading: false,
        //categoryKeyExpanded: state.categoryKeyExpanded ? { ...state.categoryKeyExpanded, questionId: null } : null,
        categoryInViewingOrEditing,
        questionInAddingViewingOrEditing: null
      };
    }

    case ActionTypes.LOAD_CATEGORY_QUESTIONS: {
      const { categoryRow } = action.payload;
      const { id, rootId, questionRows, hasMoreQuestions } = categoryRow;
      //const { id, questionRows, hasMoreQuestions } = action.payload; // category doesn't contain inAdding 
      //console.log('>>>>>>>>>>>>LOAD_CATEGORY_QUESTIONS', { id, questionRows, hasMoreQuestions })
      // let { rootCategoryRows } = state;
      // const rootCat: ICategory = rootCategoryRows.find(c => c.id === rootId)!;
      // DeepClone.catIdToSet = id;
      // DeepClone.newCat = categoryRow;
      // const rootCatModified = new DeepClone(rootCat).categoryRow;
      // const rootCategoryRows2 = rootCategoryRows.map(c => c.id === rootId
      //   ? rootCatModified
      //   : new DeepClone(c).categoryRow
      // )
      /*
      const questions: IQuestion[] = questionRowDtos.map(questionRow => new Question(questionRow).question);
      */
      //if (questions.length > 0 && category!.questions.map(q => q.id).includes(questions[0].id)) {
      // privremeno  TODO  uradi isto i u group/answers
      // We have, at two places:
      //   <EditCategory inLine={true} />
      //   <EditCategory inLine={false} />
      //   so we execute loadCategoryQuestions() twice in QuestionList, but OK
      // TODOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
      // return state;
      //}
      /* TODO sredi kad budes radio adding
      const questionInAdding = category!.questionRows.find(q => q.inAdding);
      if (questionInAdding) {
        //questions.unshift(questionInAdding);
        console.assert(state.mode === Mode.AddingQuestion, "expected Mode.AddingQuestion")
      }
      */
      // const arr = questionRows.map(questionRow => (questionRow.included
      //   ? {
      //     ...questionRow,
      //   }
      //   : questionRow));
      return {
        ...state,
        //categoryRows: rootCategoryRowsNEW,
        // state.categories.map((c: ICategory) => c.id === id
        //   ? {
        //     ...c,
        //     questionRows: c.questionRows.concat(questionRows),
        //     hasMoreQuestions,
        //     inAdding: c.inAdding,
        //     isExpanded: c.isExpanded
        //   }
        //   : c),
        // keep mode
        questionLoading: false
      }
    }

    case ActionTypes.DELETE: {
      const { id } = action.payload;
      // TODO Popravi
      return {
        ...state,
        formMode: FormMode.None,
        error: undefined,
        whichRowId: undefined
      };
    }

    case ActionTypes.CANCEL_CATEGORY_FORM:
    case ActionTypes.CLOSE_CATEGORY_FORM: {
      return {
        ...state,
        formMode: FormMode.None
      };
    }


    // First we add a new question to the category.guestions
    // After user clicks Save, we call createQuestion 
    /*
    case ActionTypes.ADD_QUESTION: {
      const { categoryInfo } = action.payload;
      const { categoryKey, level } = categoryInfo;
      const { partitionKey, id } = categoryKey;
      const question: IQuestion = {
        ...initialQuestion,
        partitionKey: id ?? '',
        parentCategory: id,
        inAdding: true
      }
      return {
        ...state,
        mode: Mode.AddingQuestion,
        questionInViewingOrEditing: question
      };
    }
    */

    case ActionTypes.SET_QUESTION: {
      const { question, formMode } = action.payload;
      const mode = formMode === FormMode.AddingQuestion
        ? FormMode.AddingQuestion
        : formMode === FormMode.EditingQuestion
          ? FormMode.EditingQuestion
          : formMode === FormMode.ViewingQuestion
            ? FormMode.ViewingQuestion
            : FormMode.None;
      return {
        ...state,
        categoryInViewingOrEditing: null,
        questionInAddingViewingOrEditing: question,
        formMode: mode,
        error: undefined,
        loading: false
      };
    }

    case ActionTypes.SET_QUESTION_AFTER_ASSIGN_ANSWER: {
      const { question } = action.payload;
      const { parentCategory, id } = question;
      const inAdding = state.formMode === FormMode.AddingQuestion;

      // for inAdding, _id is IDBValidKey('000000000000000000000000')
      // thats why we look for q.inAdding instead of q._id === _id
      // const x = state.categories.filter(c => c.id === parentCategory).filter(q=>q.id === id);
      // console.error('SET_QUESTION_AFTER_ASSIGN_ANSWER', {x})

      // TODO Popravi
      // const rootCategoryRows = newFirstLevelCategoryRows.map((c: ICategory) => c.id === parentCategory
      //   ? {
      //     ...c,
      //     questionRows: inAdding
      //       ? c.questionRows.map(q => q.inAdding ? { ...question, inAdding: q.inAdding } : q)
      //       : c.questionRows.map(q => q.id === id ? { ...question } : q), // TODO sta, ako je inViewing
      //     inAdding: c.inAdding
      //   }
      //   : c
      // );
      return {
        ...state,
        formMode: state.formMode, // keep mode
        loading: false
      };
    }
    case ActionTypes.SET_VIEWING_EDITING_QUESTION: {
      // Popravi
      return {
        ...state,
        // firstLevelCategoryRows: newFirstLevelCategoryRows.map((c: ICategory) => ({
        //   ...c,
        //   questionRows: c.questionRows.map((q: IQuestionRow) => ({ ...q }))
        // })),
        formMode: FormMode.None
      }
    }

    case ActionTypes.SET_QUESTION_TO_VIEW: {
      const { question } = action.payload;
      const { partitionKey, id, parentCategory } = question;
      const { categoryKeyExpanded } = state;
      return {
        ...state,
        formMode: FormMode.ViewingQuestion,
        loading: false,
        categoryKeyExpanded: categoryKeyExpanded
          ? { ...categoryKeyExpanded, questionId: categoryKeyExpanded.id === parentCategory ? id : null }
          : null,
        questionInAddingViewingOrEditing: question
      }
    }

    case ActionTypes.SET_QUESTION_TO_EDIT: {
      const { question } = action.payload;
      const { partitionKey, id, parentCategory } = question;
      const { categoryKeyExpanded } = state;
      return {
        ...state,
        loading: false,
        categoryKeyExpanded: categoryKeyExpanded
          ? { ...categoryKeyExpanded, questionId: categoryKeyExpanded.id === parentCategory ? id : null }
          : null,
        questionInAddingViewingOrEditing: question,
        formMode: FormMode.EditingQuestion
      }
    }

    case ActionTypes.DELETE_QUESTION: {
      const { question } = action.payload;
      const { parentCategory, id } = question;
      return {
        ...state, // Popravi
        // categoryKeyExpanded: newRootCategoryRows.map((c: ICategory) => c.id === parentCategory
        //   ? {
        //     ...c,
        //     questionRows: c.questionRows.filter(q => q.id !== id)
        //   }
        //   : c
        // ),
        questionInAddingViewingOrEditing: null,
        formMode: FormMode.None
      }
    }

    case ActionTypes.CANCEL_QUESTION_FORM:
    case ActionTypes.CLOSE_QUESTION_FORM: {
      const { question } = action.payload;
      const { partitionKey, id, parentCategory } = question;
      let questionInViewingOrEditing: IQuestion | null = null
      const category = state.firstLevelCategoryRows.find(c => c.id === parentCategory)
      let questionRows: IQuestionRow[] = [];
      // POPRAVI
      switch (state.formMode) {
        case FormMode.AddingQuestion: {
          console.assert(category!.inAdding, "expected category.inAdding");
          questionRows = category!.questionRows.filter(q => !q.inAdding)
          // TODO questionInViewingOrEditing: ?;
          break;
        }

        case FormMode.ViewingQuestion:
        case FormMode.EditingQuestion: {
          questionInViewingOrEditing = null;
          break;
        }

        default:
          break;
      }

      return {
        ...state,
        // firstLevelCategoryRows: newFirstLevelCategoryRows.map((c: ICategory) => c.id === parentCategory
        //   ? { ...c, /*questionRows: questionRows, numOfQuestions: questionRows.length,*/ inAdding: false }
        //   : c
        // ),
        formMode: FormMode.None,
        questionInAddingViewingOrEditing: questionInViewingOrEditing
      };
    }

    default:
      return state;  // TODO throw error
  }
};


function findCategory(categoryRows: ICategoryRow[], id: string | null): ICategory | undefined {
  let cat: ICategory | undefined = categoryRows.find(c => c.id === (id ?? 'null'));
  if (!cat) {
    try {
      categoryRows.forEach(c => {
        cat = findCategory(c.subCategories, id);
        if (cat) {
          throw new Error("Stop the loop");
        }
      })
    }
    catch (e) {
      console.log("Loop stopped");
    }
  }
  return cat;
}

export class DeepClone {
  static idToSet: string;
  static newCategoryRow: ICategoryRow;
  constructor(categoryRow: ICategoryRow) {
    const { partitionKey, id, rootId, parentCategory, title, link, kind, header, level, variations, numOfQuestions,
      hasSubCategories, subCategories, created, modified, questionRows, isExpanded } = categoryRow;

    const subCats = subCategories.map((cat: ICategoryRow) => {
      if (cat.id === DeepClone.idToSet) {
        return { ...DeepClone.newCategoryRow }
      }
      else {
        return new DeepClone(cat).categoryRow
      }
    });

    this.categoryRow = {
      partitionKey,
      id,
      kind,
      rootId,
      parentCategory,
      title,
      link,
      header,
      level,
      hasSubCategories,
      subCategories: subCats,
      numOfQuestions,
      questionRows,
      variations: variations ?? [],
      created,
      modified,
      isExpanded
    }
  }
  categoryRow: ICategoryRow;
}


