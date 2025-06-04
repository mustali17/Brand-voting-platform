import { ArrowLeft, Calendar, Shield } from "lucide-react";

export default function TermsAndConditions() {
  const termsComponent = (heading: string, context: string) => {
    return (
      <div className='mb-8 group'>
        <h3 className='text-sm font-semibold text-gray-900 mb-3'>{heading}</h3>
        <p className='text-gray-600 text-sm leading-relaxed'>{context}</p>
      </div>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-white w-full'>
      {/* Hero Section */}
      <section className='py-16 px-6'>
        <div className='max-w-7xl mx-auto text-center'>
          <h3 className='text-xl md:text-2xl font-bold text-gray-900 mb-4'>
            Terms of Service
          </h3>
          <p className='text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Please read these terms carefully before using our platform. By
            using FirmCorner, you agree to be bound by these terms.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className='pb-20 px-6'>
        <div className='max-w-6xl mx-auto'>
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12'>
            {termsComponent(
              "1. Acceptance of Terms",
              "By using FirmCorner, you agree to comply with these Terms of Service and our Privacy Policy. If you do not agree, you may not use our platform."
            )}

            {termsComponent(
              "2. Eligibility",
              "You must be at least 13 years old to use FirmCorner. By registering, you confirm that you meet this age requirement."
            )}

            {termsComponent(
              "3. User Accounts",
              "You are responsible for maintaining the security of your account and password. You must provide accurate and complete information when registering. You may not impersonate someone else or create an account for anyone other than yourself."
            )}

            {termsComponent(
              "4. User-Generated Content",
              "You may upload content (brand profiles, product listings, images, etc.) to FirmCorner. You retain ownership of your content but grant FirmCorner a license to display and distribute it as part of the platform. You are solely responsible for your content. Do not upload anything illegal, offensive, or infringing on others' rights."
            )}

            {termsComponent(
              "5. Brand Profiles and Product Listings",
              "You may create a brand profile and add products under that brand. All content you submit must be truthful and accurate. We reserve the right to remove any content that violates our guidelines."
            )}

            {termsComponent(
              "6. Voting and Rankings",
              "Users may vote on products within the platform. Rankings are calculated based on votes per product subcategory. Manipulation of votes or the ranking system is prohibited."
            )}

            {termsComponent(
              "7. Prohibited Use",
              "You agree not to: Post misleading, harmful, or unlawful content. Infringe on intellectual property rights. Attempt to disrupt or misuse the platform. Use automated tools to create accounts, vote, or scrape data."
            )}

            {termsComponent(
              "8. Privacy Policy Summary",
              "We collect personal information such as your email, username, and activity on the site. Your data is used to operate the platform, personalize content, and improve the user experience. We do not sell your data to third parties. You can delete your account at any time from your profile settings."
            )}

            {termsComponent(
              "9. Account Termination",
              "FirmCorner may suspend or terminate your account if you violate these terms or abuse the platform."
            )}

            {termsComponent(
              "10. Changes to Terms",
              "We may update these terms from time to time. If we make significant changes, we'll notify you by email or via the platform."
            )}

            {/* Contact Section */}
            <div className='mt-12 pt-8 border-t border-gray-100'>
              <div className='bg-gray-50 rounded-xl p-6'>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Questions about these terms?
                </h3>
                <p className='text-gray-600 text-sm mb-4'>
                  If you have any questions about these Terms of Service, please
                  don&apos;t hesitate to contact us.
                </p>
                <a
                  href='mailto:legal@firmcorner.com'
                  className='inline-flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors'
                >
                  info@firmcorner.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
