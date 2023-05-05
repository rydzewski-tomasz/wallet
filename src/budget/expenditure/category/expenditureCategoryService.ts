import { ExpenditureCategoryRepository } from './expenditureCategoryRepository';
import { ExpenditureMainCategory } from './main/expenditureMainCategory';
import { uuidGenerator } from '../../../core/uuidGenerator';

export interface ExpenditureCategoryService {
  addMainCategory: (categoryName: string) => Promise<ExpenditureMainCategory>;
}

export class ExpenditureCategoryServiceImpl implements ExpenditureCategoryService {
  private categoryRepository: ExpenditureCategoryRepository;

  constructor({ categoryRepository }: { categoryRepository: ExpenditureCategoryRepository }) {
    this.categoryRepository = categoryRepository;
  }

  async addMainCategory(categoryName: string): Promise<ExpenditureMainCategory> {
    const category = new ExpenditureMainCategory({
      uuid: uuidGenerator.generate(),
      name: categoryName,
      subcategories: []
    });
    await this.categoryRepository.save(category);
    return category;
  }
}
