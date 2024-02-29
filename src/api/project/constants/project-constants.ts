enum Category {
  Technology = 'Technology',
  QualityAssurance = 'Quality Assurance',
  Design = 'Design',
  Management = 'Management',
  ProductStrategy = 'Product Strategy',
}

export const positionToCategoryMap: Record<string, Category> = {
  'Software Engineer': Category.Technology,
  'Senior Software Engineer': Category.Technology,
  'Lead Software Engineer': Category.Technology,
  'Associate Quality Assurance Engineer': Category.QualityAssurance,
  'Quality Assurance Engineer': Category.QualityAssurance,
  'Senior Quality Assurance Engineer': Category.QualityAssurance,
  'Lead Quality Assurance Engineer': Category.QualityAssurance,
  'Senior Designer': Category.Design,
  'Lead Designer': Category.Design,
  Designer: Category.Design,
  'Engineering Manager': Category.Management,
  'Senior Engineering Manager': Category.Management,
  'Director of Engineering': Category.Management,
  'Senior Director of Engineering': Category.Management,
  'Product Manager': Category.ProductStrategy,
  'Senior Product Manager': Category.ProductStrategy,
  'Project Manager': Category.Management,
  'Senior Project Manager': Category.Management,
};
