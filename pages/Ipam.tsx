import React, { useState } from 'react';
import { Grid, List, Plus, Filter, Monitor } from 'lucide-react';
import { IpAddress } from '../types';

// Generate Mock Subnet
const generateSubnet = (prefix: string): IpAddress[] => {
    const ips: IpAddress[] = [];
    for (let i = 1; i < 255; i++) {
        const statusRandom = Math.random();
        ips.push({
            address: `${prefix}.${i}`,
            status: statusRandom > 0.8 ? 'Free' : statusRandom > 0.6 ? 'Reserved' : 'Active',
            device: statusRandom <= 0.6 ? `Host-${i}` : undefined,
            lastSeen: statusRandom <= 0.6 ? '10 mins ago' : undefined
        });
    }
    return ips;
};

const Ipam: React.FC = () => {
    const [subnet, setSubnet] = useState(generateSubnet('192.168.1'));
    const [selectedIp, setSelectedIp] = useState<IpAddress | null>(null);

    const handleReserveIp = () => {
        // Find first free IP
        const firstFree = subnet.find(ip => ip.status === 'Free');
        if (firstFree) {
            updateIpStatus(firstFree.address, 'Reserved');
            alert(`Reserved IP: ${firstFree.address}`);
        } else {
            alert("No free IPs available in this subnet!");
        }
    };

    const updateIpStatus = (address: string, status: 'Active' | 'Free' | 'Reserved' | 'DHCP') => {
        const newSubnet = subnet.map(ip => 
            ip.address === address ? { ...ip, status, device: status === 'Free' ? undefined : ip.device } : ip
        );
        setSubnet(newSubnet);
        // Update selected if needed
        if (selectedIp && selectedIp.address === address) {
            setSelectedIp({ ...selectedIp, status, device: status === 'Free' ? undefined : selectedIp.device });
        }
    };

    const handleRelease = () => {
        if (!selectedIp) return;
        if (confirm(`Are you sure you want to release ${selectedIp.address}?`)) {
            updateIpStatus(selectedIp.address, 'Free');
        }
    };

    const handleEdit = () => {
        if (!selectedIp) return;
        const newDevice = prompt("Enter device name for this IP:", selectedIp.device || "");
        if (newDevice !== null) {
            const newSubnet = subnet.map(ip => 
                ip.address === selectedIp.address ? { ...ip, device: newDevice, status: 'Active' as const } : ip
            );
            setSubnet(newSubnet);
            setSelectedIp({ ...selectedIp, device: newDevice, status: 'Active' });
        }
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Grid className="text-green-400"/> IP Address Management
                    </h1>
                    <p className="text-sm text-gray-400">Subnet: 192.168.1.0/24 (VLAN 10 - Management)</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 hover:bg-gray-700">
                        <Filter size={18}/>
                    </button>
                    <button 
                        onClick={handleReserveIp}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2 active:scale-95 transition-transform"
                    >
                        <Plus size={18}/> Reserve IP
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-gray-900 border border-gray-800 rounded-lg p-6 flex gap-6 overflow-hidden">
                {/* Grid View */}
                <div className="flex-1 overflow-y-auto">
                    <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-2">
                        {subnet.map((ip) => (
                            <div 
                                key={ip.address}
                                onClick={() => setSelectedIp(ip)}
                                title={`${ip.address} - ${ip.status}`}
                                className={`
                                    aspect-square rounded-sm text-[10px] flex items-center justify-center cursor-pointer transition-all hover:scale-110
                                    ${ip.status === 'Free' ? 'bg-gray-800 text-gray-500 hover:bg-gray-700' : 
                                      ip.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 
                                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'}
                                    ${selectedIp?.address === ip.address ? 'ring-2 ring-white' : ''}
                                `}
                            >
                                {ip.address.split('.')[3]}
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-6 flex gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-green-500/20 border border-green-500/50 rounded-sm"></div>
                            <span className="text-gray-300">Active</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-yellow-500/20 border border-yellow-500/50 rounded-sm"></div>
                            <span className="text-gray-300">Reserved</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 bg-gray-800 rounded-sm"></div>
                            <span className="text-gray-300">Free</span>
                        </div>
                    </div>
                </div>

                {/* Details Panel */}
                <div className="w-80 bg-gray-950 border border-gray-800 rounded p-6 flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-6 border-b border-gray-800 pb-4">IP Details</h3>
                    
                    {selectedIp ? (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500">IP Address</label>
                                <div className="text-xl font-mono text-white">{selectedIp.address}</div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">Status</label>
                                <div>
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                                        selectedIp.status === 'Active' ? 'bg-green-900 text-green-400' :
                                        selectedIp.status === 'Reserved' ? 'bg-yellow-900 text-yellow-400' :
                                        'bg-gray-800 text-gray-400'
                                    }`}>
                                        {selectedIp.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                            {selectedIp.device && (
                                <div>
                                    <label className="text-xs text-gray-500">Associated Device</label>
                                    <div className="flex items-center gap-2 text-blue-400 mt-1">
                                        <Monitor size={16}/> {selectedIp.device}
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="text-xs text-gray-500">Last Seen</label>
                                <div className="text-gray-300">{selectedIp.lastSeen || 'Never'}</div>
                            </div>

                            <div className="pt-6 mt-auto">
                                <button 
                                    onClick={handleEdit}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded mb-3 text-sm"
                                >
                                    Edit Assignment
                                </button>
                                <button 
                                    onClick={handleRelease}
                                    className="w-full border border-red-500/50 text-red-400 hover:bg-red-500/10 py-2 rounded text-sm"
                                >
                                    Release IP
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-center mt-10">
                            Select an IP address from the grid to view details.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Ipam;