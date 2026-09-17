"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";
import {
  Users,
  User,
  Plus,
  Trash2,
  Edit2,
  Heart,
  Baby,
  Shield,
  Stethoscope,
  FlaskConical,
  Activity,
  CalendarDays,
  Loader2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import FamilyProfileSwitcher, {
  FamilyMember,
} from "@/components/FamilyProfileSwitcher";
import AddNewSessionDialog from "../dashboard/_components/AddNewSessionDialog";

export default function FamilyPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit Modal State
  const [editingMember, setEditingMember] = useState<FamilyMember | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    memberId: "",
    name: "",
    relationship: "Child",
    age: "",
    gender: "Unspecified",
    bloodGroup: "O+",
    allergies: "",
    medicalHistory: "",
  });

  useEffect(() => {
    if (isUserLoaded && user) {
      fetchMembers();
    } else if (isUserLoaded && !user) {
      setLoading(false);
    }
  }, [isUserLoaded, user]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/family-members");
      if (Array.isArray(res.data)) {
        setMembers(res.data);
      }
    } catch (err) {
      console.error("Error fetching family members:", err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (member: FamilyMember) => {
    setEditingMember(member);
    setEditForm({
      memberId: member.memberId,
      name: member.name,
      relationship: member.relationship,
      age: member.age ? String(member.age) : "",
      gender: member.gender || "Unspecified",
      bloodGroup: member.bloodGroup || "O+",
      allergies: member.allergies || "",
      medicalHistory: member.medicalHistory || "",
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name.trim()) return;

    try {
      setSubmittingEdit(true);
      const res = await axios.put("/api/family-members", editForm);
      if (res.data) {
        setMembers((prev) =>
          prev.map((m) => (m.memberId === res.data.memberId ? res.data : m))
        );
        setIsEditModalOpen(false);
        setEditingMember(null);
      }
    } catch (err) {
      console.error("Error updating family member:", err);
      alert("Failed to update profile. Please try again.");
    } finally {
      setSubmittingEdit(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm("Are you sure you want to remove this family profile?")) return;

    try {
      setDeletingId(memberId);
      await axios.delete(`/api/family-members?memberId=${memberId}`);
      setMembers((prev) => prev.filter((m) => m.memberId !== memberId));
    } catch (err: any) {
      alert(err?.response?.data?.error || "Could not delete family member.");
    } finally {
      setDeletingId(null);
    }
  };

  const getRelationshipBadge = (rel: string) => {
    switch (rel) {
      case "Child":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
            <Baby className="w-3 h-3 text-blue-600" />
            Child
          </span>
        );
      case "Spouse":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-600" />
            Spouse
          </span>
        );
      case "Parent":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-600" />
            Parent
          </span>
        );
      case "Self":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <User className="w-3 h-3 text-emerald-600" />
            Primary Account Holder
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
            <Users className="w-3 h-3 text-purple-600" />
            {rel}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] gap-3">
        <Loader2 className="w-9 h-9 text-[#a4161a] animate-spin" />
        <p className="text-xs font-semibold text-gray-500">
          Loading family profiles...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Canvas */}
      <section className="bg-gradient-to-b from-rose-50/80 via-white to-gray-50/40 p-6 sm:p-8 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-[#a4161a] border border-red-200 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              Dependent & Family Care
            </span>
          </div>
          <h1 className="font-extrabold text-2xl sm:text-3xl text-gray-900 tracking-tight">
            Family <span className="italic font-serif font-normal text-[#a4161a]">Health Profiles</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-xl">
            Manage separate health records, consultations, allergies, and lab report timelines for your spouse, children, and dependent parents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <FamilyProfileSwitcher
            onSelectMember={(m) => {
              if (m) {
                // Focus member
              }
            }}
          />
        </div>
      </section>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const isSelf = member.relationship === "Self";
          return (
            <div
              key={member.memberId}
              className="p-6 rounded-3xl border border-gray-200 bg-white hover:border-[#a4161a]/30 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-rose-50 border-2 border-rose-200 text-[#a4161a] font-extrabold flex items-center justify-center text-lg shadow-2xs">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-gray-900">
                        {member.name}
                      </h3>
                      <div className="mt-1">{getRelationshipBadge(member.relationship)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(member)}
                      className="p-1.5 text-gray-400 hover:text-[#a4161a] hover:bg-rose-50 rounded-lg transition-colors"
                      title="Edit Profile"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {!isSelf && (
                      <button
                        onClick={() => handleDeleteMember(member.memberId)}
                        disabled={deletingId === member.memberId}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Profile"
                      >
                        {deletingId === member.memberId ? (
                          <Loader2 className="w-4 h-4 animate-spin text-red-600" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Vitals & Clinical Data */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-gray-50/80 border border-gray-100 text-center my-4">
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium block">Age</span>
                    <span className="text-xs font-extrabold text-gray-900">
                      {member.age ? `${member.age} yrs` : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium block">Gender</span>
                    <span className="text-xs font-extrabold text-gray-900">
                      {member.gender || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 font-medium block">Blood</span>
                    <span className="text-xs font-extrabold text-[#a4161a]">
                      {member.bloodGroup || "O+"}
                    </span>
                  </div>
                </div>

                {/* Allergies & Conditions */}
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-amber-900">
                    <span className="font-bold block text-[11px] text-amber-800">
                      ⚠️ Allergies:
                    </span>
                    <p className="text-xs mt-0.5">{member.allergies || "None reported"}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-blue-900">
                    <span className="font-bold block text-[11px] text-blue-800">
                      📋 Medical History:
                    </span>
                    <p className="text-xs mt-0.5">{member.medicalHistory || "None reported"}</p>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                <Link href={`/timeline?familyMemberId=${member.memberId}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs font-semibold h-9 border-gray-200 hover:border-[#a4161a]"
                  >
                    <Activity className="w-3.5 h-3.5 mr-1 text-[#a4161a]" />
                    Timeline
                  </Button>
                </Link>

                <AddNewSessionDialog
                  btnText={`+ Consult for ${member.name.split(" ")[0]}`}
                  className="!text-white font-bold bg-[#a4161a] hover:bg-[#8b1116] text-xs h-9 px-4 rounded-xl"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Family Profile Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md sm:rounded-3xl p-6 shadow-2xl border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-[#a4161a]" />
              Update {editingMember?.name}&apos;s Profile
            </DialogTitle>
            <DialogDescription className="text-xs text-gray-500">
              Modify clinical vitals, allergies, or medical history for this family member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-3 mt-2">
            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Relationship
                </label>
                <select
                  value={editForm.relationship}
                  onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
                  disabled={editingMember?.relationship === "Self"}
                  className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a] disabled:opacity-60"
                >
                  <option value="Self">Self</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Child">Child</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-800 block mb-1">
                  Age (Years)
                </label>
                <input
                  type="number"
                  placeholder="Age"
                  value={editForm.age}
                  onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
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
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
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
                  value={editForm.bloodGroup}
                  onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}
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
                Known Allergies
              </label>
              <input
                type="text"
                placeholder="E.g., Penicillin, Peanuts..."
                value={editForm.allergies}
                onChange={(e) => setEditForm({ ...editForm, allergies: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-800 block mb-1">
                Medical History / Conditions
              </label>
              <input
                type="text"
                placeholder="E.g., Asthma, Hypertension..."
                value={editForm.medicalHistory}
                onChange={(e) => setEditForm({ ...editForm, medicalHistory: e.target.value })}
                className="w-full p-2.5 text-xs rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#a4161a]"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submittingEdit || !editForm.name.trim()}
                className="bg-[#a4161a] hover:bg-[#8b1116] text-white font-extrabold text-xs h-9 px-5 rounded-xl shadow-xs"
              >
                {submittingEdit ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
