import { ExpenditureCategoryRepository } from './expenditureCategoryRepository';
import { ExpenditureCategory } from './expenditureCategory';
import { uuidGenerator } from '../../../core/uuidGenerator';

export interface ExpenditureCategoryService {
  addMainCategory: (categoryName: string) => Promise<ExpenditureCategory>;
}

export class ExpenditureCategoryServiceImpl implements ExpenditureCategoryService {
  private categoryRepository: ExpenditureCategoryRepository;

  constructor({ categoryRepository }: { categoryRepository: ExpenditureCategoryRepository }) {
    this.categoryRepository = categoryRepository;
  }

  async addMainCategory(categoryName: string): Promise<ExpenditureCategory> {
    const category = new ExpenditureCategory({
      uuid: uuidGenerator.generate(),
      name: categoryName,
      subcategories: []
    });
    await this.categoryRepository.save(category);
    return category;
  }
}
