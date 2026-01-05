
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Player } from '../data/players';
import { Trophy, Users, CheckCircle2, RotateCcw, Shirt, ChevronRight, Save, Medal } from 'lucide-react';

const PlayerCard = ({
    player,
    isSelected,
    onClick,
    disabled
}: {
    player: Player;
    isSelected: boolean;
    onClick: () => void;
    disabled: boolean;
}) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={!disabled || isSelected ? { scale: 1.02, translateY: -5 } : {}}
            whileTap={!disabled || isSelected ? { scale: 0.98 } : {}}
            onClick={onClick}
            className={`relative cursor-pointer rounded-2xl border-2 transition-all duration-300 ${isSelected
                ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
                } ${disabled && !isSelected ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
        >
            <div className="aspect-[4/5] relative rounded-t-[14px] overflow-hidden">
                <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {isSelected && (
                    <div className="absolute top-3 right-3 bg-emerald-500 rounded-full p-1 shadow-lg z-10">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                )}

                {/* Stats Badge */}
                {(player.wins !== undefined || player.losses !== undefined) && (
                    <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10">
                        <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-blue-400">
                            PJ: {player.total_matches || 0}
                        </div>
                        <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-emerald-400">
                            W: {player.wins || 0}
                        </div>
                        <div className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 text-[9px] font-bold text-red-400">
                            L: {player.losses || 0}
                        </div>
                    </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                            {player.position}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold truncate">{player.name}</h3>
                </div>
            </div>

            <div className="p-3 text-[11px] leading-snug text-gray-400">
                {player.description}
            </div>
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
        if (activeTab === 'history') {
            fetchHistory();
        }
    }, [activeTab]);

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
        if (!teams) return;
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

    return (
        <div className="min-h-screen bg-[#050505] text-white px-4 py-12 md:px-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-16 text-center">
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
                </div>
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
                            {players.map((player) => (
                                <PlayerCard
                                    key={player.id}
                                    player={player}
                                    isSelected={selectedIds.includes(player.id)}
                                    onClick={() => togglePlayer(player.id)}
                                    disabled={selectedIds.length >= 14}
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
                                            {!saved ? (
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
        </div>
    );
}
