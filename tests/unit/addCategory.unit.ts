import { UuidGenerator } from '../../src/core/uuidGenerator';
import { AddCategory } from '../../src/category/addCategory';
import { Category } from '../../src/category/category';
import { CategoryRepository } from '../../src/category/categoryRepository';

describe('AddCategory unit test', () => {
  let categoryRepository: CategoryRepository;
  let addCategory: AddCategory;
  let uuid: string;

  beforeEach(() => {
    uuid = 'testUuid';
    const uuidGenerator: UuidGenerator = { generate: () => uuid };
    categoryRepository = { save: jest.fn() };
    addCategory = new AddCategory(categoryRepository, uuidGenerator)
  });

  it('GIVEN valid input WHEN addCategory THEN save new category on db', async () => {
    // GIVEN

    // WHEN
    await addCategory.add('Category Name');

    // THEN
    const expected: Category = new Category(uuid, 'Category Name');
    expect(categoryRepository.save).toBeCalledWith(expected);
  });

  it('GIVEN valid input WHEN addCategory THEN return new category', async () => {
    // GIVEN

    // WHEN
    const result = await addCategory.add('Category Name');

    // THEN
    const expected: Category = new Category(uuid, 'Category Name');
    expect(result).toStrictEqual(expected);
  });
});
