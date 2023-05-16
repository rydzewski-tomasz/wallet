import { ExpenditureCategoryRepository } from './expenditureCategoryRepository';
import { ExpenditureCategory } from './expenditureCategory';
import { Guid } from '../../../core/guid';
import { createErrorResult, createSuccessResult, Result } from '../../../core/result';
import { ExpenditureSubcategory } from './expenditureSubcategory';

export enum ExpenditureCategoryErrorType {
  CategoryAlreadyExists = 'CategoryAlreadyExists',
  SubcategoryAlreadyExists = 'SubcategoryAlreadyExists',
  CategoryNotFound = 'CategoryNotFound'
}

export interface ExpenditureCategoryService {
  addCategory: (categoryName: string) => Promise<Result<ExpenditureCategory, ExpenditureCategoryErrorType>>;
  addSubcategory: (input: { subcategoryName: string; categoryId: Guid }) => Promise<Result<ExpenditureCategory, ExpenditureCategoryErrorType>>;
}

export class ExpenditureCategoryServiceImpl implements ExpenditureCategoryService {
  private categoryRepository: ExpenditureCategoryRepository;

  constructor({ categoryRepository }: { categoryRepository: ExpenditureCategoryRepository }) {
    this.categoryRepository = categoryRepository;
  }

  async addCategory(categoryName: string): Promise<Result<ExpenditureCategory, ExpenditureCategoryErrorType>> {
    if (await this.categoryRepository.findByName(categoryName)) {
      return createErrorResult(ExpenditureCategoryErrorType.CategoryAlreadyExists);
    }

    const category = new ExpenditureCategory({
      id: Guid.create(),
      name: categoryName,
      subcategories: []
    });
    await this.categoryRepository.save(category);
    return createSuccessResult(category);
  }

  async addSubcategory({ categoryId, subcategoryName }: { subcategoryName: string; categoryId: Guid }): Promise<Result<ExpenditureCategory, ExpenditureCategoryErrorType>> {
    const category = await this.categoryRepository.findById(categoryId);
    const subcategory = new ExpenditureSubcategory({
      id: Guid.create(),
      name: subcategoryName
    });

    if (!category) {
      return createErrorResult(ExpenditureCategoryErrorType.CategoryNotFound);
    }

    try {
      category.addSubcategory(subcategory);
    } catch (e) {
      if ((e as Error).message === 'SubcategoryAlreadyExists') {
        return createErrorResult(ExpenditureCategoryErrorType.SubcategoryAlreadyExists);
      } else {
        throw e;
      }
    }

    await this.categoryRepository.save(category);

    return createSuccessResult(category);
  }
}
