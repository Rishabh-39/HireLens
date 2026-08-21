import { useEffect, useState } from 'react';
import { X, Plus, Check } from 'lucide-react';
import { CandidateShell } from './CandidateShell';
import { usersApi } from '../../api/users.api';
import { BackButton } from '../../components/ui/BackButton';

export function CandidateProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState('');
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState('');

  const load = () => {
    usersApi.getMe().then((data) => {
      setProfile(data);
      setName(data.name);
      setRoles(data.jobPreferences?.map((p: any) => p.roleName) ?? []);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const addRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles([...roles, newRole.trim()]);
      setNewRole('');
    }
  };

  const removeRole = (role: string) => setRoles(roles.filter((r) => r !== role));

  const savePreferences = async () => {
    await usersApi.setJobPreferences(roles);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const saveName = async () => {
    await usersApi.updateMe({ name });
    load();
  };

  if (!profile) return <CandidateShell><p className="text-ink-500">Loading…</p></CandidateShell>;

  return (
    <CandidateShell>
      <BackButton to="/dashboard" label="Back to dashboard" className="mb-4" />
      <h1 className="font-display text-2xl font-semibold">Profile</h1>
      <p className="mt-1 text-ink-500">Manage your details and preferred job roles.</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="panel p-6">
          <h2 className="mb-4 font-display font-semibold">Basic info</h2>
          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-ink-300">Full name</span>
            <input
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-ink-300">Email</span>
            <input className="input-field opacity-60" value={profile.email} disabled />
          </label>
          <button onClick={saveName} className="btn-secondary">
            Save changes
          </button>
        </div>

        <div className="panel p-6">
          <h2 className="mb-4 font-display font-semibold">Preferred job roles</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {roles.map((role) => (
              <span key={role} className="badge gap-1.5">
                {role}
                <button onClick={() => removeRole(role)} aria-label={`Remove ${role}`}>
                  <X size={12} />
                </button>
              </span>
            ))}
            {roles.length === 0 && <p className="text-sm text-ink-500">No roles selected yet.</p>}
          </div>
          <div className="flex gap-2">
            <input
              className="input-field"
              placeholder="e.g. Backend Developer"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addRole())}
            />
            <button onClick={addRole} className="btn-secondary shrink-0 px-3">
              <Plus size={18} />
            </button>
          </div>
          <button onClick={savePreferences} className="btn-primary mt-4 w-full">
            {saved ? (
              <>
                <Check size={16} /> Saved
              </>
            ) : (
              'Save preferences'
            )}
          </button>
        </div>
      </div>
    </CandidateShell>
  );
}
