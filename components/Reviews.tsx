
import React, { useState } from 'react';
import Card from './ui/Card.tsx';
import Button from './ui/Button.tsx';
import { MOCK_REVIEWS } from '../constants.ts';
import type { Review } from '../types.ts';
import { Star, MessageSquareQuote, PlusCircle, X } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext.tsx';

const StarRatingDisplay: React.FC<{ rating: number }> = ({ rating }) => {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                />
            ))}
        </div>
    );
};

const InteractiveStarRating: React.FC<{ rating: number, setRating: (rating: number) => void }> = ({ rating, setRating }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`h-8 w-8 cursor-pointer transition-colors ${
                        (hoverRating || rating) > i ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'
                    }`}
                    onClick={() => setRating(i + 1)}
                    onMouseEnter={() => setHoverRating(i + 1)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${i + 1} stars`}
                />
            ))}
        </div>
    );
};


const Reviews: React.FC = () => {
    const { user } = useAppContext();
    const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newReviewText, setNewReviewText] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newReviewRating === 0 || !newReviewText.trim()) {
            return;
        }

        const newReview: Review = {
            id: `REV_${Date.now()}`,
            user: {
                name: user.name,
                avatarUrl: user.avatarUrl,
            },
            rating: newReviewRating,
            text: newReviewText,
            timestamp: new Date().toISOString(),
        };

        setReviews([newReview, ...reviews]);

        setIsFormOpen(false);
        setNewReviewText('');
        setNewReviewRating(0);
    };

    return (
        <Card className="animate-slide-in-up">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                    <MessageSquareQuote className="h-8 w-8 text-brand-primary" />
                    <div>
                        <h2 className="text-2xl font-bold text-white">Отзывы наших участников</h2>
                        <p className="text-gray-400">Что говорят о нас те, кто уже зарабатывает с MatrixFlow.</p>
                    </div>
                </div>
                 {!isFormOpen && (
                    <Button onClick={() => setIsFormOpen(true)} className="w-full md:w-auto">
                        <PlusCircle className="h-5 w-5 mr-2" />
                        Оставить отзыв
                    </Button>
                )}
            </div>

            {isFormOpen && (
                <Card className="!bg-dark-900 mb-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-lg font-semibold text-white">Ваш отзыв</h3>
                         <button onClick={() => setIsFormOpen(false)} className="p-1 rounded-full hover:bg-dark-700" aria-label="Закрыть форму">
                            <X className="h-5 w-5 text-gray-400" />
                         </button>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Ваша оценка</label>
                            <InteractiveStarRating rating={newReviewRating} setRating={setNewReviewRating} />
                        </div>
                        <div>
                             <label htmlFor="reviewText" className="block text-sm font-medium text-gray-300 mb-1">Текст отзыва</label>
                             <textarea
                                id="reviewText"
                                value={newReviewText}
                                onChange={(e) => setNewReviewText(e.target.value)}
                                placeholder="Поделитесь вашими впечатлениями о проекте..."
                                required
                                rows={4}
                                className="w-full p-3 bg-dark-800 border border-dark-700 rounded-lg focus:ring-2 focus:ring-brand-primary focus:outline-none transition-all"
                            />
                        </div>
                         <div className="text-right">
                            <Button type="submit" disabled={!newReviewText.trim() || newReviewRating === 0}>
                                Отправить отзыв
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                    <Card key={review.id} className="!bg-dark-700/50 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <img src={review.user.avatarUrl} alt={review.user.name} className="h-12 w-12 rounded-full" />
                                <div>
                                    <p className="font-semibold text-white">{review.user.name}</p>
                                    <StarRatingDisplay rating={review.rating} />
                                </div>
                            </div>
                            <blockquote className="text-gray-300 italic border-l-4 border-brand-primary pl-4">
                                {review.text}
                            </blockquote>
                        </div>
                        <p className="text-xs text-gray-500 text-right mt-4">{new Date(review.timestamp).toLocaleDateString('ru-RU')}</p>
                    </Card>
                ))}
            </div>
        </Card>
    );
};

export default Reviews;
