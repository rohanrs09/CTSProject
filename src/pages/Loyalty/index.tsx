import React from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { LoyaltyAccount, Redemption } from '../../types';

const Loyalty: React.FC = () => {
  const { user } = useAuth();
  const [loyaltyAccount, setLoyaltyAccount] = React.useState<LoyaltyAccount | null>(null);
  const [redemptions, setRedemptions] = React.useState<Redemption[]>([]);

  React.useEffect(() => {
    // TODO: Fetch loyalty account and redemptions from API
  }, []);

  return (
    <Container className="mt-4">
      <Row>
        <Col md={6}>
          <h2>Loyalty Program</h2>
          {loyaltyAccount && (
            <Card className="mb-4">
              <Card.Body>
                <h5>Your Account</h5>
                <p>Points: {loyaltyAccount.points}</p>
                <p>Tier: {loyaltyAccount.tier}</p>
                <p>Member Since: {new Date(loyaltyAccount.joinDate).toLocaleDateString()}</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          <h3>Redemption History</h3>
          <Card>
            <Card.Body>
              <Table striped hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Points</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {redemptions.map((redemption) => (
                    <tr key={redemption.id}>
                      <td>{new Date(redemption.createdAt).toLocaleDateString()}</td>
                      <td>{redemption.points}</td>
                      <td>{redemption.status}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Loyalty; 