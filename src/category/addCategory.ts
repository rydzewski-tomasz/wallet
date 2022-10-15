import { UuidGenerator } from '../core/uuidGenerator';
import { Category } from './category';
import { CategoryRepository } from './categoryRepository';

export class AddCategory {
  constructor(
    private categoryRepository: CategoryRepository,
    private uuidGenerator: UuidGenerator
  ) { }

  async add(categoryName: string): Promise<Category> {
    const category = new Category(this.uuidGenerator.generate(), categoryName);
    await this.categoryRepository.save(category);
    return category;
  }
}
