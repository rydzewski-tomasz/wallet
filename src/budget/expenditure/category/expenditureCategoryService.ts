import { UuidGenerator } from '../../../core/uuidGenerator';
import { ExpenditureCategory } from './expenditureCategory';
import { ExpenditureCategoryRepository } from './expenditureCategoryRepository';

export interface ExpenditureCategoryService {
  add: (categoryName: string) => Promise<ExpenditureCategory>;
}

export class ExpenditureCategoryServiceImpl implements ExpenditureCategoryService {
  private categoryRepository: ExpenditureCategoryRepository;
  private uuidGenerator: UuidGenerator;

  constructor({ categoryRepository, uuidGenerator }: { categoryRepository: ExpenditureCategoryRepository; uuidGenerator: UuidGenerator }) {
    this.categoryRepository = categoryRepository;
    this.uuidGenerator = uuidGenerator;
  }

  async add(categoryName: string): Promise<ExpenditureCategory> {
    const category = new ExpenditureCategory({
      uuid: this.uuidGenerator.generate(),
      name: categoryName
    });
    await this.categoryRepository.save(category);
    return category;
  }
}
