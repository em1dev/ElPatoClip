import { Link } from 'react-router-dom';
import * as S from '../styles';

export const PrivacyPage = () => (
  <S.Container>
    <h1>Privacy Policy</h1>
    <i>Last updated 20/02/2024</i>

    <p>
      This privacy notice for <b>El Pato Clip </b>
      describes how and why we might collect,
      store, use, and/or share your information when you visit our
      website at <Link to="https://clip.elpato.dev">https://clip.elpato.dev</Link> or any website of
      ours that links to this privacy notice.
    </p>

    <p>
      If you do not agree with our policies and practices, please do not use our services. If you still have 
      any questions or concerns, please contact me at niv3k.business@gmail.com.
    </p>

    <p>
      All source code is publically available at <Link to="https://github.com/Niv3K-El-Pato/ElPatoClip">Github</Link>
    </p>

    <h2>
      What information do we store?
    </h2>

    <p>
      When you visit, use, or navigate to our website,
      we may process personal information based on how you interact with the service.
      If you decide not to log in, no personal information will be stored about your interaction.

      <ul>
        <li><b>We do not process sensitive personal information</b></li>
        <li><b>We do not send any personal information to third parties</b></li>
      </ul>

      When you sign up to our website, depending on your authentication method we might store
      <ul>
        <li><b>Third party public personal identifying user id, such as a Tiktok user id</b></li>
        <li><b>Authentication tokens when linking an account to allow the upload of clips</b></li>
      </ul>
    </p>

    <h2>
      We ensure to keep your information secure and private
    </h2>

    <p>
      Any access credentials, tokens, and required authentication information are securely
      stored using common encryption techniques, and we ensure to keep them up to date.
    </p>

    <p>
      Transmission of information to and from the website is sent using SSL encryption,
      and we ensure to display stored information only pertaining to the authenticated user and no one else.
    </p>

    <p>
      We ensure that all information is kept private and confidential. Due to the fact that no internet communication is 100% secure,
      we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will
      not be able to defeat our security. In the case this happens, we will invalidate all
      affected credentials and tokens and communicate the breach publicly.
    </p>

    <h2>Access to your data</h2>
    <p>
      Access to all the information stored about you can be granted by contacting us at niv3k.business@gmail.com.
      For general information you can access your profile page to view or delete your account.
    </p>

  </S.Container>
);