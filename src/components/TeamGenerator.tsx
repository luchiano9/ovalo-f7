import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { type Player } from '../data/players';
import { Trophy, Users, CheckCircle2, RotateCcw, Shirt, ChevronRight, Save, Medal, Plus, X, Upload, Activity, Edit2 } from 'lucide-react';

const PlayerCard = ({
    player,
    isSelected,
    onClick,
    disabled,
    onEdit
}: {
    player: Player;
    isSelected: boolean;
    onClick: () => void;
    disabled: boolean;
    onEdit?: (player: Player) => void;
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={!disabled || isSelected ? { scale: 0.95 } : {}}
            onClick={disabled && !isSelected ? undefined : onClick}
            className={`relative aspect-[2/3] rounded-[2rem] overflow-hidden cursor-pointer group isolation-isolate ${isSelected
                ? 'ring-4 ring-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]'
                : 'border border-white/10'
                } ${disabled && !isSelected ? 'opacity-30 grayscale cursor-not-allowed' : ''}`}
        >
            {/* Image background */}
            <img
                src={player.image}
                alt={player.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Glassy Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="absolute inset-0 bg-white/[0.03] backdrop-brightness-125 z-0" />

            {/* Shimmer/Glint Animation layer */}
            <motion.div
                animate={{
                    x: ['-100%', '200%'],
                }}
                transition={useMemo(() => ({
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 10 + (parseInt(player.id.replace(/\D/g, '') || '0') % 15),
                    delay: (parseInt(player.id.replace(/\D/g, '') || '0') % 10) * 1.5,
                    ease: "easeInOut",
                }), [player.id])}
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                    background: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 80%)',
                    width: '100%',
                    willChange: 'transform', // Mejora el rendimiento al scrollear
                }}
            />

            {/* Stats Badge */}
            {(player.wins !== undefined || player.losses !== undefined) && (
                <div className="absolute top-4 left-4 flex flex-col gap-1 items-start z-30">
                    <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-blue-400">
                        PJ: {player.total_matches || 0}
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-emerald-400">
                        W: {player.wins || 0}
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-black text-red-500">
                        L: {player.losses || 0}
                    </div>
                </div>
            )}

            {/* Selection Check */}
            {isSelected && (
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-4 right-4 z-30 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg"
                >
                    <CheckCircle2 className="w-5 h-5" />
                </motion.div>
            )}

            {/* Edit Button */}
            {onEdit && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(player);
                    }}
                    className="absolute top-4 right-4 z-40 bg-white/10 backdrop-blur-md border border-white/20 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
                >
                    <Edit2 className="w-4 h-4" />
                </button>
            )}

            {/* Info Container */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-30 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                        {player.position}
                    </span>
                </div>
                <div>
                    <h3 className="text-2xl font-black italic tracking-tighter text-white leading-none uppercase drop-shadow-lg">
                        {player.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 line-clamp-4 font-medium leading-tight mt-1">
                        {player.description}
                    </p>
                </div>
            </div>

            {/* Subtle Inner Glow */}
            <div className="absolute inset-0 rounded-[2rem] border border-white/20 z-40 pointer-events-none" />
        </motion.div>
    );
};

const TeamDisplay = ({ title, team, color, score, setScore }: {
    title: string,
    team: Player[],
    color: string,
    score: number,
    setScore: (s: number) => void
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl bg-white/5 border border-white/10 ${color === 'emerald' ? 'shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'shadow-[0_0_30px_rgba(59,130,246,0.1)]'}`}
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className={`text-2xl font-black italic tracking-tighter ${color === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {title}
                    </h3>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold mb-1">Goles</span>
                            <input
                                type="number"
                                value={score}
                                onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                                className="w-16 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-center text-xl font-bold focus:outline-none focus:border-emerald-500/50"
                            />
                        </div>
                    </div>
                </div>
                <Shirt className={`w-12 h-12 opacity-20 ${color === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`} />
            </div>

            <div className="space-y-2">
                {team.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex items-center gap-3">
                            <img src={player.image} className="w-10 h-10 rounded-full object-cover border-2 border-white/10" alt="" />
                            <div>
                                <p className="text-sm font-bold text-white">{player.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-medium">{player.position}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

interface Props {
    initialPlayers: Player[];
}

const MatchHistory = ({ matches, players }: { matches: any[], players: Player[] }) => {
    const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || 'Jugador desconocido';

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-24">
            {matches.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10">
                    <p className="text-gray-500 font-medium">No hay partidos registrados aún.</p>
                </div>
            ) : (
                matches.map((match) => (
                    <motion.div
                        key={match.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                            {/* Team A */}
                            <div className="flex-1 text-right">
                                <h4 className="text-emerald-400 font-black italic mb-3">EQUIPO BLANCO</h4>
                                <div className="flex flex-wrap justify-end gap-2">
                                    {match.team_a_players.map((id: string) => (
                                        <span key={id} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-gray-400">
                                            {getPlayerName(id)}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Score */}
                            <div className="flex flex-col items-center px-8 py-4 bg-white/5 rounded-2xl border border-white/10 min-w-[140px]">
                                <span className="text-[10px] uppercase text-gray-500 font-black mb-1">
                                    {new Date(match.date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                                </span>
                                <div className="flex items-center gap-4 text-4xl font-black italic tracking-tighter">
                                    <span className={match.winner === 'teamA' ? 'text-emerald-400' : 'text-white'}>{match.team_a_score}</span>
                                    <span className="text-white/20">-</span>
                                    <span className={match.winner === 'teamB' ? 'text-blue-400' : 'text-white'}>{match.team_b_score}</span>
                                </div>
                            </div>

                            {/* Team B */}
                            <div className="flex-1 text-left">
                                <h4 className="text-blue-400 font-black italic mb-3">EQUIPO NEGRO</h4>
                                <div className="flex flex-wrap gap-2">
                                    {match.team_b_players.map((id: string) => (
                                        <span key={id} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/5 rounded-md text-gray-400">
                                            {getPlayerName(id)}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))
            )}
        </div>
    );
};

export default function TeamGenerator({ initialPlayers }: Props) {
    const [players, setPlayers] = useState<Player[]>(initialPlayers);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [teams, setTeams] = useState<{ teamA: Player[], teamB: Player[] } | null>(null);
    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<'generator' | 'history'>('generator');
    const [matchHistory, setMatchHistory] = useState<any[]>([]);
    const [userRole, setUserRole] = useState<'guest' | 'admin' | null>(null);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
    const [newPlayer, setNewPlayer] = useState({
        name: '',
        score: 50,
        description: '',
        position: 'Mediocampista',
        image: ''
    });
    const [isCreating, setIsCreating] = useState(false);

    const handleSavePlayer = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            const method = editingPlayerId ? 'PUT' : 'POST';
            const body = editingPlayerId ? { ...newPlayer, id: editingPlayerId } : newPlayer;

            const res = await fetch('/api/players', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const getRes = await fetch('/api/match');
                if (getRes.ok) {
                    const freshPlayers = await getRes.json();
                    setPlayers(freshPlayers);
                }
                setShowAddForm(false);
                setEditingPlayerId(null);
                setNewPlayer({ name: '', score: 50, description: '', position: 'Mediocampista', image: '' });
            }
        } catch (e) {
            console.error(e);
            alert('Error al guardar jugador');
        } finally {
            setIsCreating(false);
        }
    };

    const openEditModal = (player: Player) => {
        setEditingPlayerId(player.id);
        setNewPlayer({
            name: player.name,
            score: player.score,
            description: player.description || '',
            position: player.position,
            image: player.image || ''
        });
        setShowAddForm(true);
    };

    const fetchHistory = async () => {
        try {
            const res = await fetch('/api/matches');
            if (res.ok) {
                const data = await res.json();
                setMatchHistory(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    useMemo(() => {
        if (activeTab === 'history' && userRole) {
            fetchHistory();
        }
    }, [activeTab, userRole]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (loginData.username === 'luchi' && loginData.password === 'luchisco69') {
            setUserRole('admin');
        } else {
            setLoginError(true);
            setTimeout(() => setLoginError(false), 2000);
        }
    };

    const togglePlayer = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(pId => pId !== id));
            setTeams(null);
            setSaved(false);
        } else if (selectedIds.length < 14) {
            setSelectedIds(prev => [...prev, id]);
            setTeams(null);
            setSaved(false);
        }
    };

    const generateTeams = () => {
        if (selectedIds.length < 14) return;

        const selectedPlayers = players.filter(p => selectedIds.includes(p.id));
        const sorted = [...selectedPlayers].sort((a, b) => b.score - a.score);

        const teamA: Player[] = [];
        const teamB: Player[] = [];
        let totalScoreA = 0;
        let totalScoreB = 0;

        sorted.forEach(player => {
            if (teamA.length < 7 && (totalScoreA <= totalScoreB || teamB.length === 7)) {
                teamA.push(player);
                totalScoreA += player.score;
            } else {
                teamB.push(player);
                totalScoreB += player.score;
            }
        });

        setTeams({ teamA, teamB });
        setScoreA(0);
        setScoreB(0);
        setSaved(false);

        setTimeout(() => {
            document.getElementById('teams-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const recordMatch = async () => {
        if (!teams || userRole !== 'admin') return;
        setIsSaving(true);

        const winner = scoreA > scoreB ? 'teamA' : (scoreB > scoreA ? 'teamB' : 'draw');

        try {
            const res = await fetch('/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    teamAIds: teams.teamA.map(p => p.id),
                    teamBIds: teams.teamB.map(p => p.id),
                    teamAScore: scoreA,
                    teamBScore: scoreB,
                    winner
                })
            });

            if (res.ok) {
                setSaved(true);
                const getRes = await fetch('/api/match');
                if (getRes.ok) {
                    const freshPlayers = await getRes.json();
                    setPlayers(freshPlayers);
                }
            }
        } catch (e) {
            console.error(e);
            alert('Error al guardar el partido');
        } finally {
            setIsSaving(false);
        }
    };

    const reset = () => {
        setSelectedIds([]);
        setTeams(null);
        setSaved(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const sortedPlayers = useMemo(() => {
        return [...players].sort((a, b) => {
            const winsA = a.wins || 0;
            const winsB = b.wins || 0;
            if (winsB !== winsA) return winsB - winsA;

            const pjA = a.total_matches || 0;
            const pjB = b.total_matches || 0;
            if (pjB !== pjA) return pjB - pjA;

            return Math.random() - 0.5;
        });
    }, [players]);

    if (!userRole) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl space-y-8">
                        <div className="text-center space-y-2">
                            <div className="inline-block p-4 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 mb-4">
                                <Trophy className="w-12 h-12 text-emerald-500" />
                            </div>
                            <h2 className="text-4xl font-black tracking-tighter italic text-white">BIENVENIDO</h2>
                            <p className="text-gray-500 font-medium">Fútbol Lunes Ovalo</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Usuario"
                                value={loginData.username}
                                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                            />
                            <input
                                type="password"
                                placeholder="Contraseña"
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                            />

                            <AnimatePresence>
                                {loginError && (
                                    <motion.p
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="text-red-400 text-sm font-bold text-center"
                                    >
                                        Datos incorrectos
                                    </motion.p>
                                )}
                            </AnimatePresence>

                            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest italic">
                                Entrar como Luchi
                            </button>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0b0b0b] px-4 text-gray-500 font-bold tracking-widest">O</span></div>
                        </div>

                        <button
                            onClick={() => setUserRole('guest')}
                            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest italic"
                        >
                            Continuar como Invitado
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white px-4 py-12 md:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 text-center relative">
                <button
                    onClick={() => setUserRole(null)}
                    className="absolute top-0 right-0 p-2 text-gray-500 hover:text-white transition-colors"
                    title="Cerrar Sesión"
                >
                    <RotateCcw className="w-6 h-6 rotate-180" />
                </button>
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6"
                >
                    <Trophy className="w-10 h-10 text-emerald-500" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter italic mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                    FUTBOL LUNES <span className="text-emerald-500 underline decoration-4 underline-offset-8">OVALO</span>
                </h1>

                {/* Tabs */}
                <div className="flex justify-center gap-4 mt-8">
                    <button
                        onClick={() => setActiveTab('generator')}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'generator' ? 'bg-white/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        Generador
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'history' ? 'bg-white/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'text-gray-500 hover:text-white'}`}
                    >
                        Historial
                    </button>
                    {userRole === 'admin' && (
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="px-6 py-2 rounded-xl font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all flex items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Agregar Jugador
                        </button>
                    )}
                </div>
                {userRole === 'guest' && (
                    <p className="mt-4 text-[10px] uppercase tracking-widest text-emerald-500/40 font-black italic">Modo Lectura - No podés guardar partidos</p>
                )}
            </div>

            <div className="max-w-7xl mx-auto">
                {activeTab === 'generator' ? (
                    <>
                        {/* Selection Stats Bar */}
                        <div className="sticky top-6 z-40 mb-12 flex justify-center">
                            <motion.div
                                layout
                                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 flex items-center gap-8 shadow-2xl"
                            >
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-emerald-500" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] uppercase text-gray-500 font-bold leading-none">Seleccionados</span>
                                        <span className="text-xl font-mono font-black">{selectedIds.length}/14</span>
                                    </div>
                                </div>

                                <div className="w-[1px] h-8 bg-white/10" />

                                <button
                                    onClick={generateTeams}
                                    disabled={selectedIds.length !== 14}
                                    className={`px-8 py-2 rounded-full font-black text-sm uppercase tracking-widest transition-all ${selectedIds.length === 14
                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95'
                                        : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                                        }`}
                                >
                                    Armar Equipos
                                </button>

                                {selectedIds.length > 0 && (
                                    <>
                                        <div className="w-[1px] h-8 bg-white/10" />
                                        <button
                                            onClick={reset}
                                            className="p-2 text-gray-500 hover:text-white transition-colors"
                                        >
                                            <RotateCcw className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        </div>

                        {/* Players Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-24">
                            {sortedPlayers.map((player) => (
                                <PlayerCard
                                    key={player.id}
                                    player={player}
                                    isSelected={selectedIds.includes(player.id)}
                                    onClick={() => togglePlayer(player.id)}
                                    disabled={selectedIds.length >= 14}
                                    onEdit={userRole === 'admin' ? openEditModal : undefined}
                                />
                            ))}
                        </div>

                        {/* Teams Results */}
                        <div id="teams-section">
                            <AnimatePresence>
                                {teams && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="space-y-8"
                                    >
                                        <div className="grid md:grid-cols-2 gap-8 py-12 border-t border-white/10">
                                            <TeamDisplay title="EQUIPO BLANCO" team={teams.teamA} color="emerald" score={scoreA} setScore={setScoreA} />
                                            <TeamDisplay title="EQUIPO NEGRO" team={teams.teamB} color="blue" score={scoreB} setScore={setScoreB} />
                                        </div>

                                        <motion.div
                                            className="flex flex-col items-center gap-6 pb-24"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            {userRole === 'admin' ? (
                                                !saved ? (
                                                    <button
                                                        onClick={recordMatch}
                                                        disabled={isSaving}
                                                        className="group relative flex items-center gap-3 px-12 py-4 rounded-2xl bg-emerald-500 font-black text-lg uppercase tracking-tighter italic transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                                    >
                                                        <Save className={`w-6 h-6 ${isSaving ? 'animate-pulse' : ''}`} />
                                                        {isSaving ? 'Guardando...' : 'Finalizar Partido y Guardar Estadísticas'}
                                                        <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                                                    </button>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-4 text-emerald-400">
                                                        <div className="flex items-center gap-3 px-12 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 font-black text-lg uppercase tracking-tighter italic">
                                                            <Medal className="w-8 h-8" />
                                                            Partido Guardado Correctamente
                                                        </div>
                                                        <p className="text-gray-500 font-medium">Las estadísticas de los jugadores han sido actualizadas.</p>
                                                    </div>
                                                )
                                            ) : (
                                                <div className="px-12 py-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 font-bold italic">
                                                    Iniciá como Admin para guardar el partido
                                                </div>
                                            )}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <MatchHistory matches={matchHistory} players={players} />
                )}
            </div>

            {/* Add Player Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-xl bg-[#0b0b0b] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 space-y-8">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                                        {editingPlayerId ? 'Editar Jugador' : 'Nuevo Jugador'}
                                    </h3>
                                    <button onClick={() => {
                                        setShowAddForm(false);
                                        setEditingPlayerId(null);
                                        setNewPlayer({ name: '', score: 50, description: '', position: 'Mediocampista', image: '' });
                                    }} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSavePlayer} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest ml-1">Nombre Completo</label>
                                            <input
                                                required
                                                type="text"
                                                placeholder="Ej: Luchini Messi"
                                                value={newPlayer.name}
                                                onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest ml-1">Posición</label>
                                            <select
                                                value={newPlayer.position}
                                                onChange={(e) => setNewPlayer({ ...newPlayer, position: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 appearance-none cursor-pointer"
                                            >
                                                <option value="Delantero">Delantero</option>
                                                <option value="Mediocampista">Mediocampista</option>
                                                <option value="Defensor">Defensor</option>
                                                <option value="Arquero">Arquero</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest ml-1">Habilidad (0-100)</label>
                                            <input
                                                required
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={newPlayer.score}
                                                onChange={(e) => setNewPlayer({ ...newPlayer, score: parseInt(e.target.value) || 0 })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest ml-1">URL de Imagen (Opcional)</label>
                                            <input
                                                type="text"
                                                placeholder="https://... o /players/foto.png"
                                                value={newPlayer.image}
                                                onChange={(e) => setNewPlayer({ ...newPlayer, image: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50"
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest ml-1">Descripción corta</label>
                                            <textarea
                                                rows={2}
                                                placeholder="Un crack total..."
                                                value={newPlayer.description}
                                                onChange={(e) => setNewPlayer({ ...newPlayer, description: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-emerald-500/50 resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        disabled={isCreating}
                                        className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-5 rounded-2xl transition-all hover:scale-[1.02] active:scale-[0.98] uppercase tracking-widest italic flex items-center justify-center gap-3"
                                    >
                                        {isCreating ? 'Guardando...' : (
                                            <>
                                                {editingPlayerId ? <Edit2 className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
                                                {editingPlayerId ? 'Guardar Cambios' : 'Crear Jugador'}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
