import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
  Img,
  Hr,
} from "@react-email/components";
import * as React from "react";

export default function Email({
  userName = "",
  type = "budget-alert",
  data = {
   
  },
}) {
  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Budget Alert — You’re Reaching Your Limit</Preview>
        <Body style={styles.body}>
          <Container style={styles.mainContainer}>
            {/* HEADER */}
            <Section style={styles.header}>
              {/* <Img
                src="/Preview.png"
                width="42"
                height="42"
                alt="Finac Logo"
                style={styles.logo}
              /> */}
              <Heading style={styles.brand}>Finac</Heading>
            </Section>

            {/* TITLE */}
            <Section style={styles.contentContainer}>
              <Heading style={styles.title}>Budget Alert </Heading>
              <Text style={styles.text}>
                Hi <strong>{userName}</strong>,
              </Text>
              <Text style={styles.text}>
                You’ve used <strong>{(data?.percentage ?? 0).toFixed(1)}%</strong> of your
                monthly budget. It might be a good time to review your expenses.
              </Text>

              {/* STATS CARD */}
              <Section style={styles.statsCard}>
                <div style={styles.statRow}>
                  <Text style={styles.label}>Budget Amount</Text>
                  <Text style={styles.value}>${(data?.budgetAmount ?? 0).toLocaleString()}</Text>
                </div>
                <Hr style={styles.divider} />
                <div style={styles.statRow}>
                  <Text style={styles.label}>Spent So Far</Text>
                  <Text style={styles.value}>${(data?.totalExpenses ?? 0).toLocaleString()}</Text>
                </div>
                <Hr style={styles.divider} />
                <div style={styles.statRow}>
                  <Text style={styles.label}>Remaining</Text>
                  <Text style={styles.remainingValue}>
                    ${(data?.budgetAmount - data?.totalExpenses).toLocaleString()}
                  </Text>
                </div>
              </Section>

              {/* CTA BUTTON */}
              <Section style={styles.ctaContainer}>
                <a href="https://finac.app/dashboard" style={styles.button}>
                  View My Dashboard
                </a>
              </Section>

              <Text style={styles.footerNote}>
                This is an automated alert from your Finac account. You’re receiving this
                because you enabled budget tracking.
              </Text>
            </Section>

            {/* FOOTER */}
            <Section style={styles.footer}>
              <Text style={styles.footerText}>
                © {new Date().getFullYear()} Finac Inc.
              </Text>
              
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }

  return null;
}

const styles = {
  body: {
    backgroundColor: "#f5f7fa",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif",
    padding: "40px 0",
  },
  mainContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    maxWidth: "500px",
    margin: "0 auto",
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.08)",
  },
  header: {
    backgroundColor: "#0b5fff",
    color: "#ffffff",
    padding: "24px 32px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  logo: {
    borderRadius: "8px",
  },
  brand: {
    color: "#ffffff",
    fontSize: "22px",
    fontWeight: "700",
    margin: 0,
  },
  contentContainer: {
    padding: "32px 28px",
  },
  title: {
    color: "#111827",
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "16px",
  },
  text: {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "1.6",
    marginBottom: "14px",
  },
  statsCard: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "20px",
    margin: "24px 0",
    border: "1px solid #e5e7eb",
  },
  statRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
  },
  label: {
    color: "#6b7280",
    fontSize: "15px",
  },
  value: {
    color: "#111827",
    fontWeight: "600",
    fontSize: "16px",
  },
  remainingValue: {
    color: "#0b5fff",
    fontWeight: "700",
    fontSize: "16px",
  },
  divider: {
    borderColor: "#e5e7eb",
    margin: "8px 0",
  },
  ctaContainer: {
    textAlign: "center",
    marginTop: "24px",
  },
  button: {
    backgroundColor: "#0b5fff",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 28px",
    borderRadius: "6px",
    display: "inline-block",
    fontWeight: "600",
    fontSize: "16px",
  },
  footerNote: {
    fontSize: "13px",
    color: "#6b7280",
    marginTop: "28px",
    lineHeight: "1.5",
  },
  footer: {
    textAlign: "center",
    backgroundColor: "#f9fafb",
    padding: "20px",
    borderTop: "1px solid #e5e7eb",
  },
  footerText: {
    fontSize: "13px",
    color: "#9ca3af",
    marginBottom: "6px",
  },
  unsubscribe: {
    color: "#0b5fff",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "500",
  },
};
