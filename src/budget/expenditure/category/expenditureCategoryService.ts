import { UuidGenerator } from '../../../core/uuidGenerator';
import { ExpenditureCategoryRepository } from './expenditureCategoryRepository';
import { ExpenditureMainCategory } from './main/expenditureMainCategory';

export interface ExpenditureCategoryService {
  addMainCategory: (categoryName: string) => Promise<ExpenditureMainCategory>;
}

export class ExpenditureCategoryServiceImpl implements ExpenditureCategoryService {
  private categoryRepository: ExpenditureCategoryRepository;
  private uuidGenerator: UuidGenerator;

  constructor({ categoryRepository, uuidGenerator }: { categoryRepository: ExpenditureCategoryRepository; uuidGenerator: UuidGenerator }) {
    this.categoryRepository = categoryRepository;
    this.uuidGenerator = uuidGenerator;
  }

  async addMainCategory(categoryName: string): Promise<ExpenditureMainCategory> {
    const category = new ExpenditureMainCategory({
      uuid: this.uuidGenerator.generate(),
      name: categoryName,
      subcategories: []
    });
    await this.categoryRepository.save(category);
    return category;
  }
}
