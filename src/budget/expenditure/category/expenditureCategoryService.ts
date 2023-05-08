import { ExpenditureCategoryRepository } from './expenditureCategoryRepository';
import { ExpenditureCategory } from './expenditureCategory';
import { Guid } from '../../../core/guid';

export interface ExpenditureCategoryService {
  addCategory: (categoryName: string) => Promise<ExpenditureCategory>;
  addSubcategory: (input: { subcategoryName: string; categoryUuid: string }) => Promise<ExpenditureCategory>;
}

export class ExpenditureCategoryServiceImpl implements ExpenditureCategoryService {
  private categoryRepository: ExpenditureCategoryRepository;

  constructor({ categoryRepository }: { categoryRepository: ExpenditureCategoryRepository }) {
    this.categoryRepository = categoryRepository;
  }

  async addCategory(categoryName: string): Promise<ExpenditureCategory> {
    const category = new ExpenditureCategory({
      id: Guid.create(),
      name: categoryName,
      subcategories: []
    });
    await this.categoryRepository.save(category);
    return category;
  }

  async addSubcategory(_: { subcategoryName: string; categoryUuid: string }): Promise<ExpenditureCategory> {
    throw new Error('Not implemented');
  }
}
