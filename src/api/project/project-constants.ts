enum Stream {
  Technology = 'Technology',
  QualityAssurance = 'Quality Assurance',
  Design = 'Design',
  Management = 'Management',
  ProductStrategy = 'Product Strategy',
}

export const positionToStreamMap: Record<string, Stream> = {
  'Software Engineer': Stream.Technology,
  'Senior Software Engineer': Stream.Technology,
  'Lead Software Engineer': Stream.Technology,
  'Associate Quality Assurance Engineer': Stream.QualityAssurance,
  'Quality Assurance Engineer': Stream.QualityAssurance,
  'Senior Quality Assurance Engineer': Stream.QualityAssurance,
  'Lead Quality Assurance Engineer': Stream.QualityAssurance,
  Designer: Stream.Design,
  'Senior Designer': Stream.Design,
  'Lead Designer': Stream.Design,
  'Engineering Manager': Stream.Management,
  'Senior Engineering Manager': Stream.Management,
  'Director of Engineering': Stream.Management,
  'Senior Director of Engineering': Stream.Management,
  'Product Manager': Stream.ProductStrategy,
  'Senior Product Manager': Stream.ProductStrategy,
  'Project Manager': Stream.Management,
  'Senior Project Manager': Stream.Management,
};
