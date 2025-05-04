"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Trash, Plus } from "lucide-react";
import { useState } from "react";

interface PaymentMethod {
  id: string;
  cardNumber: string;
  expiration: string;
  cvv: string;
  nameOnCard: string;
}

export function UserPayment() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [currentPayment, setCurrentPayment] = useState({
    cardNumber: "",
    expiration: "",
    cvv: "",
    nameOnCard: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentPayment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      // Update existing payment method
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === editId ? { ...currentPayment, id: editId } : method
        )
      );
    } else {
      // Add new payment method
      setPaymentMethods((prev) => [
        ...prev,
        { ...currentPayment, id: Date.now().toString() },
      ]);
    }
    setCurrentPayment({
      cardNumber: "",
      expiration: "",
      cvv: "",
      nameOnCard: "",
    });
    setIsEditing(false);
    setEditId(null);
  };

  const handleEdit = (method: PaymentMethod) => {
    setCurrentPayment(method);
    setIsEditing(true);
    setEditId(method.id);
  };

  const handleDelete = (id: string) => {
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-card rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Payment Information</h2>
      </div>

      {/* List of saved payment methods */}
      {paymentMethods.length > 0 && (
        <div className="mb-8 space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className="p-4 border rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium">
                  **** **** **** {method.cardNumber.slice(-4)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Expires {method.expiration}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(method)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(method.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit payment form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            name="cardNumber"
            value={currentPayment.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength={16}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiration">Expiration Date</Label>
            <Input
              id="expiration"
              name="expiration"
              value={currentPayment.expiration}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength={5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input
              id="cvv"
              name="cvv"
              value={currentPayment.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength={3}
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nameOnCard">Name on Card</Label>
          <Input
            id="nameOnCard"
            name="nameOnCard"
            value={currentPayment.nameOnCard}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" className="flex-1">
            {isEditing ? "Update Payment Method" : "Add Payment Method"}
          </Button>
          {isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCurrentPayment({
                  cardNumber: "",
                  expiration: "",
                  cvv: "",
                  nameOnCard: "",
                });
                setIsEditing(false);
                setEditId(null);
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
