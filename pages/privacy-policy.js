import { Typography, makeStyles, Container } from "@material-ui/core";
import Layout from "../components/layout";
import HSPaper from "../components/hs-paper";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(2)
  }
}));

export default function PrivacyPolicy({ user }) {
  const classes = useStyles();
  return (
    <Layout user={user}>
      <Container>
        <HSPaper className={classes.root}>
          <Typography variant="h4" paragraph>
            Privacy Policy for HuluSira
          </Typography>

          <Typography variant="body2" paragraph>
            At hulusira.com, accessible from https://hulusira.com, one of our
            main priorities is the privacy of our visitors. This Privacy Policy
            document contains types of information that is collected and
            recorded by hulusira.com and how we use it.
          </Typography>

          <Typography variant="body2" paragraph>
            If you have additional questions or require more information about
            our Privacy Policy, do not hesitate to contact us through email at
            hulusira.web@gmail.com
          </Typography>

          <Typography variant="h6" paragraph>
            Log Files
          </Typography>

          <Typography variant="body2" paragraph>
            hulusira.com follows a standard procedure of using log files. These
            files log visitors when they visit websites. All hosting companies
            do this and a part of hosting services' analytics. The information
            collected by log files include internet protocol (IP) addresses,
            browser type, Internet Service Provider (ISP), date and time stamp,
            referring/exit pages, and possibly the number of clicks. These are
            not linked to any information that is personally identifiable. The
            purpose of the information is for analyzing trends, administering
            the site, tracking users' movement on the website, and gathering
            demographic information.
          </Typography>

          <Typography variant="h6" paragraph>
            Cookies and Web Beacons
          </Typography>

          <Typography variant="body2" paragraph>
            Like any other website, hulusira.com uses 'cookies'. These cookies
            are used to store information including visitors' preferences, and
            the pages on the website that the visitor accessed or visited. The
            information is used to optimize the users' experience by customizing
            our web page content based on visitors' browser type and/or other
            information.
          </Typography>

          <Typography variant="h6" paragraph>
            Google DoubleClick DART Cookie
          </Typography>

          <Typography variant="body2" paragraph>
            Google is one of a third-party vendor on our site. It also uses
            cookies, known as DART cookies, to serve ads to our site visitors
            based upon their visit to www.website.com and other sites on the
            internet. However, visitors may choose to decline the use of DART
            cookies by visiting the Google ad and content network Privacy Policy
            at the following URL –{" "}
            <a href="https://policies.google.com/technologies/ads">
              https://policies.google.com/technologies/ads
            </a>
          </Typography>

          <Typography variant="h6" paragraph>
            Our Advertising Partners
          </Typography>

          <Typography variant="body2" paragraph>
            Some of advertisers on our site may use cookies and web beacons. Our
            advertising partners are listed below. Each of our advertising
            partners has their own Privacy Policy for their policies on user
            data. For easier access, we hyperlinked to their Privacy Policies
            below.
          </Typography>

          <ul>
            <li>
              <p>Google</p>
              <p>
                <a href="https://policies.google.com/technologies/ads">
                  https://policies.google.com/technologies/ads
                </a>
              </p>
            </li>
          </ul>

          <Typography variant="h6" paragraph>
            Privacy Policies
          </Typography>

          <Typography variant="body2" paragraph>
            You may consult this list to find the Privacy Policy for each of the
            advertising partners of hulusira.com. Our Privacy Policy was created
            with the help of the{" "}
            <a href="https://www.privacypolicygenerator.info">
              Privacy Policy Generator
            </a>
            .
          </Typography>

          <Typography variant="body2" paragraph>
            Third-party ad servers or ad networks uses technologies like
            cookies, JavaScript, or Web Beacons that are used in their
            respective advertisements and links that appear on hulusira.com,
            which are sent directly to users' browser. They automatically
            receive your IP address when this occurs. These technologies are
            used to measure the effectiveness of their advertising campaigns
            and/or to personalize the advertising content that you see on
            websites that you visit.
          </Typography>

          <Typography variant="body2" paragraph>
            Note that hulusira.com has no access to or control over these
            cookies that are used by third-party advertisers.
          </Typography>

          <Typography variant="h6" paragraph>
            Third Party Privacy Policies
          </Typography>

          <Typography variant="body2" paragraph>
            hulusira.com's Privacy Policy does not apply to other advertisers or
            websites. Thus, we are advising you to consult the respective
            Privacy Policies of these third-party ad servers for more detailed
            information. It may include their practices and instructions about
            how to opt-out of certain options. You may find a complete list of
            these Privacy Policies and their links here: Privacy Policy Links.
          </Typography>

          <Typography variant="body2" paragraph>
            You can choose to disable cookies through your individual browser
            options. To know more detailed information about cookie management
            with specific web browsers, it can be found at the browsers'
            respective websites. What Are Cookies?
          </Typography>

          <Typography variant="h6" paragraph>
            Children's Information
          </Typography>

          <Typography variant="body2" paragraph>
            Another part of our priority is adding protection for children while
            using the internet. We encourage parents and guardians to observe,
            participate in, and/or monitor and guide their online activity.
          </Typography>

          <Typography variant="body2" paragraph>
            hulusira.com does not knowingly collect any Personal Identifiable
            Information from children under the age of 13. If you think that
            your child provided this kind of information on our website, we
            strongly encourage you to contact us immediately and we will do our
            best efforts to promptly remove such information from our records.
          </Typography>

          <Typography variant="h6" paragraph>
            Online Privacy Policy Only
          </Typography>

          <Typography variant="body2" paragraph>
            This Privacy Policy applies only to our online activities and is
            valid for visitors to our website with regards to the information
            that they shared and/or collect in hulusira.com. This policy is not
            applicable to any information collected offline or via channels
            other than this website.
          </Typography>

          <Typography variant="h6" paragraph>
            Consent
          </Typography>

          <Typography variant="body2" paragraph>
            By using our website, you hereby consent to our Privacy Policy and
            agree to its Terms and Conditions.
          </Typography>
        </HSPaper>
      </Container>
    </Layout>
  );
}
