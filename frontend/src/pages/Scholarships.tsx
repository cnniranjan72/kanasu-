import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BigCard } from '@/components/BigCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, ExternalLink } from 'lucide-react';

interface Scholarship {
  id: string;
  title: string;
  description: string;
  eligibility: string;
  amount: string;
  link: string;
  category: string;
}

const Scholarships: React.FC = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Placeholder data
  const scholarships: Scholarship[] = [
    {
      id: '1',
      title: 'Karnataka State Scholarship',
      description: 'Financial assistance for students from economically weaker sections',
      eligibility: 'Students studying in Karnataka institutions',
      amount: '₹10,000 - ₹50,000',
      link: 'https://scholarships.gov.in',
      category: 'State Government',
    },
    {
      id: '2',
      title: 'Post Matric Scholarship for SC/ST',
      description: 'Scholarship for students from SC/ST categories',
      eligibility: 'SC/ST students pursuing higher education',
      amount: '₹15,000 - ₹1,00,000',
      link: 'https://scholarships.gov.in',
      category: 'Central Government',
    },
    {
      id: '3',
      title: 'Merit-cum-Means Scholarship',
      description: 'For meritorious students from low-income families',
      eligibility: 'Minimum 60% marks, family income below ₹6 lakhs',
      amount: '₹20,000 per year',
      link: 'https://scholarships.gov.in',
      category: 'Merit Based',
    },
    {
      id: '4',
      title: 'Girl Child Education Scholarship',
      description: 'Special scholarship to promote girl education',
      eligibility: 'Female students from Karnataka',
      amount: '₹5,000 - ₹25,000',
      link: 'https://scholarships.gov.in',
      category: 'Women Empowerment',
    },
    {
      id: '5',
      title: 'Educational Loan Scheme',
      description: 'Low-interest loans for higher education',
      eligibility: 'Students pursuing professional courses',
      amount: 'Up to ₹20 lakhs',
      link: 'https://www.vidyalakshmi.co.in',
      category: 'Loan',
    },
  ];

  const filteredScholarships = scholarships.filter(
    (scholarship) =>
      scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scholarship.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">{t('scholarships')}</h2>
        <p className="text-muted-foreground">
          Find financial assistance for your education
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search scholarships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 touch-target"
        />
      </div>

      <div className="space-y-4">
        {filteredScholarships.map((scholarship) => (
          <BigCard key={scholarship.id}>
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{scholarship.title}</h3>
                  <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {scholarship.category}
                  </span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground">
                {scholarship.description}
              </p>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Eligibility:</span>{' '}
                  <span className="text-muted-foreground">
                    {scholarship.eligibility}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Amount:</span>{' '}
                  <span className="text-primary font-semibold">
                    {scholarship.amount}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full touch-target"
                onClick={() => window.open(scholarship.link, '_blank')}
              >
                Learn More
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </BigCard>
        ))}
      </div>

      {filteredScholarships.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No scholarships found matching your search
          </p>
        </div>
      )}
    </div>
  );
};

export default Scholarships;