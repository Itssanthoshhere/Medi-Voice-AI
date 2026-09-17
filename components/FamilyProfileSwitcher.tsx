"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Users,
  User,
  Plus,
  Check,
  ChevronDown,
  X,
  Heart,
  Baby,
  Shield,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export type FamilyMember = {
  id: number;
  memberId: string;
  primaryUserEmail: string;
  name: string;
  relationship: "Self" | "Spouse" | "Child" | "Parent" | "Sibling" | "Other" | string;
  age?: number | null;
  gender?: string | null;
  bloodGroup?: string | null;
  allergies?: string | null;
  medicalHistory?: string | null;
  createdAt?: string;
};

type FamilyProfileSwitcherProps = {
  activeMemberId?: string;
  onSelectMember?: (member: FamilyMember | null) => void;
  className?: string;
  showAllOption?: boolean;
};

export default function FamilyProfileSwitcher({
  activeMemberId,
  onSelectMember,
  className = "",
  showAllOption = true,
}: FamilyProfileSwitcherProps) {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedId, setSelectedId] = useState<string>(activeMemberId || "all");
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    relationship: "Child",
    age: "",
    gender: "Unspecified",
    bloodGroup: "O+",
    allergies: "",
    medicalHistory: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/family-members");
      if (Array.isArray(res.data)) {
        setMembers(res.data);
        // Default select Self or all if not set
        if (!activeMemberId && res.data.length > 0) {
          const self = res.data.find((m) => m.relationship === "Self") || res.data[0];
          setSelectedId(self.memberId);
          if (onSelectMember) onSelectMember(self);
        }
      }
    } catch (err) {
      console.error("Error fetching family members:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (member: FamilyMember | null) => {
    const id = member ? member.memberId : "all";
    setSelectedId(id);
    setDropdownOpen(false);
    if (onSelectMember) onSelectMember(member);
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      setSubmitting(true);
      const res = await axios.post("/api/family-members", form);
      if (res.data?.memberId) {
        const newMember = res.data;
        setMembers((prev) => [...prev, newMember]);
        handleSelect(newMember);
        setIsAddModalOpen(false);
        setForm({
          name: "",
          relationship: "Child",
          age: "",
          gender: "Unspecified",
          bloodGroup: "O+",
          allergies: "",
          medicalHistory: "",
        });
      }
    } catch (err) {
      console.error("Error adding family member:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMember = members.find((m) => m.memberId === selectedId);

  const getRelationshipIcon = (rel: string) => {
    switch (rel) {
      case "Child":
        return <Baby className="w-3.5 h-3.5 text-blue-600" />;
      case "Spouse":
        return <Heart className="w-3.5 h-3.5 text-rose-600" />;
      case "Parent":
        return <Shield className="w-3.5 h-3.5 text-amber-600" />;
      case "Self":
        return <User className="w-3.5 h-3.5 text-emerald-600" />;
      default:
        return <Users className="w-3.5 h-3.5 text-purple-600" />;
    }
  };

  return (
    <div className={`relative inline-block text-left ${className}`}>
      {/* Active Profile Pill Button */}
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white border border-gray-200/90 text-gray-800 shadow-2xs hover:border-[#a4161a]/40 hover:bg-gray-50/80 transition-all"
      >
        <span className="p-1 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center">
          {selectedMember ? (
            getRelationshipIcon(selectedMember.relationship)
          ) : (
            <Users className="w-3.5 h-3.5 text-[#a4161a]" />
          )}
        </span>

        <div className="text-left leading-tight">
          <span className="block font-extrabold text-gray-900 truncate max-w-[130px]">
            {selectedId === "all"
              ? "All Family Members"
              : selectedMember?.name || "Select Profile"}
          </span>
          {selectedMember && (
            <span className="text-[10px] text-gray-400 font-medium">
              {selectedMember.relationship}
              {selectedMember.age ? ` · ${selectedMember.age}y` : ""}
            </span>
          )}
        </div>

        <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-white border border-gray-200 shadow-xl z-50 p-2 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Switch Family Profile
          </div>

          {showAllOption && (
            <button
              onClick={() => handleSelect(null)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                selectedId === "all"
                  ? "bg-rose-50 text-[#a4161a] font-extrabold"
                  : "hover:bg-gray-50 text-gray-700 font-medium"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#a4161a]" />
                <span>All Family Records</span>
              </div>
              {selectedId === "all" && <Check className="w-4 h-4 text-[#a4161a]" />}
            </button>
          )}

          <div className="max-h-56 overflow-y-auto space-y-0.5">
            {members.map((member) => {
              const isSelected = selectedId === member.memberId;
              return (
                <button
                  key={member.memberId}
                  onClick={() => handleSelect(member)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? "bg-rose-50 text-[#a4161a] font-extrabold"
                      : "hover:bg-gray-50 text-gray-700 font-medium"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {getRelationshipIcon(member.relationship)}
                    <span className="truncate max-w-[130px]">{member.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-100 text-gray-500 font-medium">
                      {member.relationship}
                    </span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-[#a4161a]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-1.5 border-t border-gray-100">
            <button
              onClick={() => {
                setDropdownOpen(false);
                setIsAddModalOpen(true);
              }}
              className="w-full text-left px-3 py-2 rounded-xl text-xs font-extrabold text-[#a4161a] bg-rose-50/50 hover:bg-rose-100/70 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Family Member
            </button>
          </div>
        </div>
      )}

      {/* Add Family Member Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md sm:rounded-3xl p-6 shadow-2xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-gray-900">
              Add Dependent / Family Member
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Create a dedicated health profile to manage consultations, lab reports, and medical history.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddMember} className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="E.g., Sarah Doe or Leo Smith"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Relationship *
                </label>
                <select
                  value={form.relationship}
                  onChange={(e) => setForm({ ...form, relationship: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other Dependent</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  placeholder="E.g., 6 or 42"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Gender
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
                >
                  <option value="Unspecified">Unspecified</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Blood Group
                </label>
                <select
                  value={form.bloodGroup}
                  onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Known Allergies (Optional)
              </label>
              <input
                type="text"
                placeholder="E.g., Penicillin, Peanuts, Latex..."
                value={form.allergies}
                onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Medical History / Conditions (Optional)
              </label>
              <input
                type="text"
                placeholder="E.g., Asthma, Diabetes Type 2, Hypertension..."
                value={form.medicalHistory}
                onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || !form.name.trim()}
                className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-extrabold text-xs h-9 px-5 rounded-xl shadow-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Family Profile"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
