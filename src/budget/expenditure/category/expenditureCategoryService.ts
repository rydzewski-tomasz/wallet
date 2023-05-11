import { ExpenditureCategoryRepository } from './expenditureCategoryRepository';
import { ExpenditureCategory } from './expenditureCategory';
import { Guid } from '../../../core/guid';
import { createErrorResult, createSuccessResult, Result } from '../../../core/result';

export enum ExpenditureCategoryErrorType {
  CATEGORY_ALREADY_EXISTS = 'CATEGORY_ALREADY_EXISTS'
}

export interface ExpenditureCategoryService {
  addCategory: (categoryName: string) => Promise<Result<ExpenditureCategory, ExpenditureCategoryErrorType>>;
  addSubcategory: (input: { subcategoryName: string; categoryUuid: string }) => Promise<Result<ExpenditureCategory, ExpenditureCategoryErrorType>>;
}

export class ExpenditureCategoryServiceImpl implements ExpenditureCategoryService {
  private categoryRepository: ExpenditureCategoryRepository;

  constructor({ categoryRepository }: { categoryRepository: ExpenditureCategoryRepository }) {
    this.categoryRepository = categoryRepository;
  }

  async addCategory(categoryName: string): Promise<Result<ExpenditureCategory, ExpenditureCategoryErrorType>> {
    if (await this.categoryRepository.findByName(categoryName)) {
      return createErrorResult(ExpenditureCategoryErrorType.CATEGORY_ALREADY_EXISTS);
    }

    const category = new ExpenditureCategory({
      id: Guid.create(),
      name: categoryName,
      subcategories: []
    });
    await this.categoryRepository.save(category);
    return createSuccessResult(category);
  }

  async addSubcategory(_: { subcategoryName: string; categoryUuid: string }): Promise<Result<ExpenditureCategory, ExpenditureCategoryErrorType>> {
    throw new Error('Not implemented');
  }
}
