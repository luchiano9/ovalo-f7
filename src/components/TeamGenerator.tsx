
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { players, type Player } from '../data/players';
import { Trophy, Users, CheckCircle2, RotateCcw, Shirt, Star } from 'lucide-react';

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
            className={`relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isSelected
                    ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] bg-emerald-500/10'
                    : 'border-white/10 bg-white/5 hover:bg-white/10'
                } ${disabled && !isSelected ? 'opacity-40 grayscale cursor-not-allowed' : ''}`}
        >
            <div className="aspect-[4/5] relative">
                <img
                    src={player.image}
                    alt={player.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {isSelected && (
                    <div className="absolute top-3 right-3 bg-emerald-500 rounded-full p-1 shadow-lg">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                            {player.position}
                        </span>
                        <span className="text-[10px] font-bold bg-amber-400 text-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-black" /> {player.score}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold truncate">{player.name}</h3>
                </div>
            </div>

            <div className="p-3 text-xs text-gray-400 line-clamp-2 leading-relaxed">
                {player.description}
            </div>
        </motion.div>
    );
};

const TeamDisplay = ({ title, team, color }: { title: string, team: Player[], color: string }) => {
    const totalScore = team.reduce((acc, p) => acc + p.score, 0);
    const avgScore = team.length > 0 ? (totalScore / team.length).toFixed(1) : 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl bg-white/5 border border-white/10 ${color === 'emerald' ? 'shadow-[0_0_30px_rgba(16,185,129,0.1)]' : 'shadow-[0_0_30px_rgba(59,130,246,0.1)]'}`}
        >
            <div className="flex justify-between items-end mb-6">
                <div>
                    <h3 className={`text-2xl font-black italic tracking-tighter ${color === 'emerald' ? 'text-emerald-400' : 'text-blue-400'}`}>
                        {title}
                    </h3>
                    <div className="flex gap-4 mt-1">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold">Total Score</span>
                            <span className="text-lg font-mono font-bold text-white">{totalScore}</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase text-gray-500 font-bold">Avg</span>
                            <span className="text-lg font-mono font-bold text-white">{avgScore}</span>
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
                        <span className="text-xs font-bold text-amber-400">{player.score}</span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default function TeamGenerator() {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [teams, setTeams] = useState<{ teamA: Player[], teamB: Player[] } | null>(null);

    const togglePlayer = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(prev => prev.filter(pId => pId !== id));
            setTeams(null);
        } else if (selectedIds.length < 14) {
            setSelectedIds(prev => [...prev, id]);
            setTeams(null);
        }
    };

    const generateTeams = () => {
        if (selectedIds.length < 14) return;

        const selectedPlayers = players.filter(p => selectedIds.includes(p.id));
        // Greedy balanced algorithm
        // Sort by score descending
        const sorted = [...selectedPlayers].sort((a, b) => b.score - a.score);

        const teamA: Player[] = [];
        const teamB: Player[] = [];
        let scoreA = 0;
        let scoreB = 0;

        sorted.forEach(player => {
            // Assign to the team with lower score to keep it balanced
            // If scores are equal, assign to the one with fewer people
            if (teamA.length < 7 && (scoreA <= scoreB || teamB.length === 7)) {
                teamA.push(player);
                scoreA += player.score;
            } else {
                teamB.push(player);
                scoreB += player.score;
            }
        });

        setTeams({ teamA, teamB });

        // Scroll to teams
        setTimeout(() => {
            document.getElementById('teams-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    const reset = () => {
        setSelectedIds([]);
        setTeams(null);
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
                    TEAM PICKER <span className="text-emerald-500 underline decoration-4 underline-offset-8">PRO</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">
                    Seleccioná los <span className="text-emerald-400 font-bold tracking-tight">14</span> cracks que juegan este lunes y armamos los equipos más parejos.
                </p>
            </div>

            <div className="max-w-7xl mx-auto">
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
                                className="grid md:grid-cols-2 gap-8 py-12 border-t border-white/10"
                            >
                                <TeamDisplay title="EQUIPO ESMERALDA" team={teams.teamA} color="emerald" />
                                <TeamDisplay title="EQUIPO AZUL" team={teams.teamB} color="blue" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
